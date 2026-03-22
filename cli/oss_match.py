#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OSS Marketplace CLI - Match Finder Tool
Find perfect project/contributor matches
"""

import argparse
import sys
import json
import io
from pathlib import Path
from typing import Optional, List, Dict
from datetime import datetime, timezone

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
    from rich.panel import Panel
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "rich", "requests"])
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
    from rich.panel import Panel

import requests

console = Console()

GITHUB_API = "https://api.github.com"
VERSION = "1.0.0"


class GitHubClient:
    """GitHub API client."""
    
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.headers = {"Accept": "application/vnd.github.v3+json"}
        if token:
            self.headers["Authorization"] = f"token {token}"
    
    def get(self, endpoint: str, params: dict = None) -> dict:
        url = f"{GITHUB_API}/{endpoint}"
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            if response.status_code == 404:
                return None
            if response.status_code == 403:
                console.print("[yellow]⚠️ Rate limit hit. Add a GitHub token with --token for more requests.[/yellow]")
                return None
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            return None
    
    def get_user(self, username: str) -> dict:
        return self.get(f"users/{username}")
    
    def get_repos(self, username: str, per_page: int = 100) -> List[dict]:
        repos = []
        page = 1
        while True:
            data = self.get(
                f"users/{username}/repos",
                params={"per_page": per_page, "page": page, "sort": "updated"}
            )
            if not data:
                break
            repos.extend(data)
            if len(data) < per_page:
                break
            page += 1
        return repos
    
    def get_repo(self, owner: str, repo: str) -> dict:
        return self.get(f"repos/{owner}/{repo}")
    
    def get_issues(self, owner: str, repo: str, state: str = "open") -> List[dict]:
        issues = []
        page = 1
        while True:
            data = self.get(
                f"repos/{owner}/{repo}/issues",
                params={"state": state, "per_page": 100, "page": page}
            )
            if not data:
                break
            issues.extend([i for i in data if "pull_request" not in i])
            if len(data) < 100:
                break
            page += 1
        return issues
    
    def get_contributors(self, owner: str, repo: str) -> List[dict]:
        return self.get(f"repos/{owner}/{repo}/contributors") or []
    
    def search_repos(self, query: str, language: str = None, sort: str = "stars", per_page: int = 30) -> List[dict]:
        params = {"q": query, "sort": sort, "per_page": per_page}
        if language:
            params["q"] += f" language:{language}"
        
        data = self.get("search/repositories", params=params)
        return data.get("items", []) if data else []
    
    def get_repo_languages(self, owner: str, repo: str) -> dict:
        return self.get(f"repos/{owner}/{repo}/languages") or {}


class MatchingEngine:
    """Engine for matching contributors with projects."""
    
    def __init__(self, github_client: GitHubClient):
        self.github = github_client
    
    def calculate_match_score(self, contributor_langs: List[str], repo_langs: Dict[str, int], 
                              repo_metrics: dict) -> dict:
        """Calculate match score between contributor and project."""
        if not contributor_langs:
            return {"score": 0, "breakdown": {}, "matching_languages": []}
        
        contrib_lang_set = set(contributor_langs)
        
        if repo_langs:
            repo_lang_set = set(repo_langs.keys())
            overlap = contrib_lang_set & repo_lang_set
            lang_score = len(overlap) / len(repo_lang_set) * 100 if repo_lang_set else 0
            matching_langs = list(overlap)
        else:
            lang_score = 50
            matching_langs = contributor_langs[:1]
        
        stars = repo_metrics.get("stargazers_count", 0)
        star_score = min(40, stars / 1000) if stars > 100 else 0
        
        issue_count = repo_metrics.get("open_issues_count", 0)
        activity_score = min(20, issue_count / 5)
        
        updated_at = repo_metrics.get("updated_at", "")
        freshness_score = 10
        if updated_at:
            try:
                update_date = datetime.strptime(updated_at[:10], "%Y-%m-%d")
                days_old = (datetime.now(timezone.utc) - update_date).days
                freshness_score = max(0, 20 - (days_old / 30))
            except:
                pass
        
        total_score = lang_score * 0.4 + star_score + activity_score + freshness_score
        
        return {
            "score": round(min(100, total_score), 1),
            "breakdown": {
                "language_match": round(lang_score, 1),
                "popularity": round(star_score, 1),
                "need_level": round(activity_score, 1),
                "freshness": round(freshness_score, 1)
            },
            "matching_languages": matching_langs
        }
    
    def get_project_health(self, repo_data: dict, issues: List[dict]) -> dict:
        """Calculate project health score."""
        updated_at = repo_data.get("updated_at", "")
        if updated_at:
            try:
                update_date = datetime.strptime(updated_at[:10], "%Y-%m-%d")
                days_since = (datetime.now(timezone.utc) - update_date).days
            except:
                days_since = 365
        else:
            days_since = 365
        
        total_issues = len(issues)
        good_first = sum(1 for i in issues if any(label.get("name", "").lower().startswith("good") 
                                                  for label in i.get("labels", [])))
        
        recent_issues = []
        for i in issues:
            created = i.get("created_at", "")
            if created:
                try:
                    created_date = datetime.strptime(created[:10], "%Y-%m-%d")
                    if (datetime.now(timezone.utc) - created_date).days < 30:
                        recent_issues.append(i)
                except:
                    pass
        
        responded = sum(1 for i in recent_issues if i.get("comments", 0) > 0)
        response_rate = (responded / len(recent_issues) * 100) if recent_issues else 50
        
        health = 100
        health -= min(30, days_since / 10)
        health -= max(0, total_issues - 50) / 2
        health += good_first * 2
        health = max(0, min(100, health))
        
        return {
            "score": round(health, 1),
            "days_since_update": days_since,
            "total_issues": total_issues,
            "good_first_issues": good_first,
            "response_rate": round(response_rate, 1),
            "needs_help": total_issues > 20,
            "active": days_since < 30
        }
    
    def find_contributor_matches(self, username: str, limit: int = 10) -> List[dict]:
        """Find projects that match a contributor's skills. Optimized for speed."""
        console.print(f"\n[cyan]🔍 Analyzing @{username}'s profile...[/cyan]\n")
        
        user = self.github.get_user(username)
        if not user:
            console.print(f"[red]❌ User @{username} not found![/red]")
            return []
        
        repos = self.github.get_repos(username)
        
        lang_counts = {}
        for repo in repos:
            if repo.get("language"):
                lang_counts[repo["language"]] = lang_counts.get(repo["language"], 0) + 1
        
        top_langs = sorted(lang_counts.keys(), key=lambda x: lang_counts[x], reverse=True)[:3]
        
        console.print(f"[green]Found expertise in: {', '.join(top_langs)}[/green]\n")
        
        matches = []
        
        console.print("[yellow]Searching for matching projects...[/yellow]")
        console.print("[dim](This uses search data directly for faster results)[/dim]\n")
        
        for lang in top_langs:
            console.print(f"[dim]Searching {lang} repositories...[/dim]")
            search_results = self.github.search_repos(f"language:{lang} stars:>100", sort="stars", per_page=30)
            
            for repo in search_results[:15]:
                owner = repo.get("owner", {})
                if owner.get("login") == username:
                    continue
                
                full_name = repo.get("full_name", "")
                if "/" not in full_name:
                    continue
                
                parts = full_name.split("/")
                owner_name, repo_name = parts[0], parts[1]
                
                match = self.calculate_match_score([lang], {}, {
                    "stargazers_count": repo.get("stargazers_count", 0),
                    "open_issues_count": repo.get("open_issues_count", 0),
                    "updated_at": repo.get("updated_at", "")
                })
                
                health_score = 50
                if repo.get("updated_at"):
                    try:
                        update_date = datetime.strptime(repo["updated_at"][:10], "%Y-%m-%d")
                        days_since = (datetime.now(timezone.utc) - update_date).days
                        health_score = max(0, 50 - (days_since / 30) * 10)
                    except:
                        health_score = 50
                
                match.update({
                    "owner": owner_name,
                    "name": repo_name,
                    "full_name": full_name,
                    "description": repo.get("description") or "No description",
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "language": repo.get("language"),
                    "issues_count": repo.get("open_issues_count", 0),
                    "good_first_issues": "?",
                    "health_score": round(health_score, 1),
                    "url": repo.get("html_url"),
                    "matching_languages": [lang],
                })
                
                matches.append(match)
                
                if len(matches) >= limit * 2:
                    break
            
            if len(matches) >= limit * 2:
                break
        
        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches[:limit]
    
    def find_maintainer_matches(self, owner: str, repo: str, limit: int = 10) -> List[dict]:
        """Find contributors that match a project's needs. Optimized for speed."""
        console.print(f"\n[cyan]🔍 Analyzing {owner}/{repo}...[/cyan]\n")
        
        full_repo = self.github.get_repo(owner, repo)
        if not full_repo:
            console.print(f"[red]❌ Repository {owner}/{repo} not found![/red]")
            return []
        
        languages = self.github.get_repo_languages(owner, repo) or {}
        issues = self.github.get_issues(owner, repo) or []
        
        info = f"""
[bold]{full_repo.get('full_name', f'{owner}/{repo}')}[/bold]
{full_repo.get('description', 'No description')}

📊 Stars: {full_repo.get('stargazers_count', 0):,}
🍴 Forks: {full_repo.get('forks_count', 0):,}
🐛 Open Issues: {len(issues)}
Languages: {', '.join(languages.keys()) if languages else 'N/A'}
        """
        console.print(Panel(info, title="📦 Project Info", border_style="cyan"))
        
        matches = []
        
        console.print("[yellow]Finding potential contributors...[/yellow]\n")
        
        for lang in list(languages.keys())[:3]:
            console.print(f"[dim]Searching {lang} developers...[/dim]")
            search_results = self.github.search_repos(f"language:{lang} stars:>50", sort="stars", per_page=20)
            
            for result in search_results[:15]:
                username = result.get("owner", {}).get("login")
                if not username or username == owner:
                    continue
                
                user = self.github.get_user(username)
                if not user:
                    continue
                
                match_score = self.calculate_match_score(
                    list(languages.keys()),
                    languages,
                    {
                        "stargazers_count": result.get("stargazers_count", 0),
                        "open_issues_count": user.get("public_repos", 0),
                        "updated_at": result.get("updated_at", "")
                    }
                )
                
                matches.append({
                    "username": username,
                    "name": user.get("name") or username,
                    "bio": user.get("bio") or "",
                    "followers": user.get("followers", 0),
                    "public_repos": user.get("public_repos", 0),
                    "score": match_score["score"],
                    "breakdown": match_score["breakdown"],
                    "url": user.get("html_url"),
                    "matching_languages": [lang]
                })
                
                if len(matches) >= limit * 2:
                    break
            
            if len(matches) >= limit * 2:
                break
        
        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches[:limit]


class MatchDisplay:
    """Display match results."""
    
    def __init__(self, console_obj: Console):
        self.console = console_obj
    
    def display_contributor_matches(self, matches: List[dict], username: str):
        """Display project matches for a contributor."""
        if not matches:
            self.console.print("\n[yellow]No matches found. Try a different username.[/yellow]")
            return
        
        self.console.print(f"\n[bold green]🎯 Found {len(matches)} matches for @{username}![/bold green]\n")
        
        for i, match in enumerate(matches, 1):
            self._display_project_card(match, i)
    
    def display_maintainer_matches(self, matches: List[dict], owner: str, repo: str):
        """Display contributor matches for a project."""
        if not matches:
            self.console.print("\n[yellow]No matches found.[/yellow]")
            return
        
        project_name = f"{owner}/{repo}"
        self.console.print(f"\n[bold green]🎯 Found {len(matches)} potential contributors![/bold green]\n")
        
        for i, match in enumerate(matches, 1):
            self._display_contributor_card(match, i)
    
    def _display_project_card(self, match: dict, index: int):
        """Display a single project match card."""
        score_color = "green" if match["score"] >= 70 else "yellow" if match["score"] >= 50 else "red"
        
        card = f"""
[bold cyan]{index}. {match.get('full_name', f"{match.get('owner')}/{match.get('name')}")}[/bold cyan]
[dim]{str(match.get('description', 'No description'))[:80]}...[/dim]

⭐ {match.get('stars', 0):,}  🍴 {match.get('forks', 0):,}  🐛 {match.get('issues_count', 0)}
🏥 Health: [green]{match.get('health_score', 0)}[/green]/100

[yellow]Matching Languages:[/yellow] {', '.join(match.get('matching_languages', [])[:3]) if match.get('matching_languages') else 'N/A'}
🐛 Good First Issues: {match.get('good_first_issues', 0)}

[link={match.get('url', '#')}]View on GitHub ↗[/link]
        """
        
        score_color_map = {"green": "bold green", "yellow": "bold yellow", "red": "bold red"}
        border = score_color_map.get(score_color, "white")
        
        self.console.print(Panel(card, title=f"🔥 Match Score: [{score_color}]{match['score']}%[/{score_color}]", 
                                  border_style=border))
        self.console.print()
    
    def _display_contributor_card(self, match: dict, index: int):
        """Display a single contributor match card."""
        score_color = "green" if match["score"] >= 70 else "yellow" if match["score"] >= 50 else "red"
        
        card = f"""
[bold cyan]{index}. {match.get('name', match['username'])}[/bold cyan] (@{match['username']})
[dim]{str(match.get('bio', ''))[:60]}...[/dim]

👥 {match.get('followers', 0)} followers  📦 {match.get('public_repos', 0)} repos

[yellow]Skills:[/yellow] {', '.join(match.get('matching_languages', [])[:4]) if match.get('matching_languages') else 'Various'}

[link={match.get('url', '#')}]View Profile ↗[/link]
        """
        
        score_color_map = {"green": "bold green", "yellow": "bold yellow", "red": "bold red"}
        border = score_color_map.get(score_color, "white")
        
        self.console.print(Panel(card, title=f"🔥 Match Score: [{score_color}]{match['score']}%[/{score_color}]", 
                                  border_style=border))
        self.console.print()


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="🌍 OSS Marketplace - Find Perfect Matches",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s find --contributor octocat        Find projects for a contributor
  %(prog)s find --maintainer facebook react  Find contributors for a project
  %(prog)s find --contributor octocat --limit 20  Show more matches
        """
    )
    
    parser.add_argument("--version", action="version", version=f"%(prog)s {VERSION}")
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    find_parser = subparsers.add_parser("find", help="Find matches")
    find_parser.add_argument("--contributor", help="Find projects for contributor")
    find_parser.add_argument("--maintainer", help="Owner username (use with --repo)")
    find_parser.add_argument("--repo", help="Repository name (use with --maintainer)")
    find_parser.add_argument("--limit", type=int, default=10, help="Number of matches to show")
    find_parser.add_argument("--token", help="GitHub token")
    find_parser.add_argument("--json", action="store_true", help="Output as JSON")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    if args.command == "find":
        github = GitHubClient(token=args.token)
        engine = MatchingEngine(github)
        display = MatchDisplay(console)
        
        if args.contributor:
            matches = engine.find_contributor_matches(args.contributor, args.limit)
            
            if args.json:
                print(json.dumps(matches, indent=2))
            else:
                display.display_contributor_matches(matches, args.contributor)
        
        elif args.maintainer and args.repo:
            matches = engine.find_maintainer_matches(args.maintainer, args.repo, args.limit)
            
            if args.json:
                print(json.dumps(matches, indent=2))
            else:
                display.display_maintainer_matches(matches, args.maintainer, args.repo)
        
        else:
            console.print("[red]❌ Please specify either --contributor OR (--maintainer AND --repo)[/red]")
            sys.exit(1)


if __name__ == "__main__":
    main()
