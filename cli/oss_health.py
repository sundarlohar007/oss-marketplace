#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OSS Marketplace CLI - Project Health Checker
Analyze and score open source project health
"""

import argparse
import sys
import json
import io
from typing import Optional, List, Dict
from datetime import datetime, timedelta, timezone

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn
    from rich.panel import Panel
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "rich", "requests"])
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn
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
    
    def get_all_pages(self, endpoint: str, params: dict = None, max_pages: int = 5) -> List[dict]:
        """Get all pages of a paginated endpoint."""
        items = []
        params = dict(params) if params else {}
        params["per_page"] = 100
        
        page = 1
        while True:
            if page > max_pages:
                break
            params["page"] = page
            data = self.get(endpoint, params=params)
            if not data:
                break
            items.extend(data)
            if len(data) < 100:
                break
            page += 1
        
        return items


class HealthAnalyzer:
    """Analyzes project health metrics."""
    
    def __init__(self, github_client: GitHubClient):
        self.github = github_client
    
    def analyze_project(self, owner: str, repo: str) -> dict:
        """Perform complete health analysis of a project."""
        console.print(f"\n[cyan]🔍 Analyzing {owner}/{repo}...[/cyan]\n")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console
        ) as progress:
            
            task1 = progress.add_task("[green]Fetching repository data...", total=None)
            repo_data = self.github.get(f"repos/{owner}/{repo}")
            if not repo_data:
                console.print(f"[red]❌ Repository {owner}/{repo} not found![/red]")
                return None
            progress.update(task1, completed=100)
            
            task2 = progress.add_task("[yellow]Analyzing issues...", total=None)
            issues = self.github.get_all_pages(
                f"repos/{owner}/{repo}/issues", 
                {"state": "open"}
            )
            issues = [i for i in issues if "pull_request" not in i]
            progress.update(task2, completed=100)
            
            task3 = progress.add_task("[blue]Analyzing commit activity...", total=None)
            commits = self.github.get_all_pages(
                f"repos/{owner}/{repo}/commits",
                {}
            )
            progress.update(task3, completed=100)
            
            task4 = progress.add_task("[magenta]Analyzing contributors...", total=None)
            contributors = self.github.get_all_pages(f"repos/{owner}/{repo}/contributors")
            progress.update(task4, completed=100)
            
            task5 = progress.add_task("[cyan]Detecting languages...", total=None)
            languages = self.github.get(f"repos/{owner}/{repo}/languages") or {}
            progress.update(task5, completed=100)
        
        console.print("[green]✅ Analysis complete!\n[/green]")
        
        health = {
            "repo": self._analyze_repo_basics(repo_data),
            "activity": self._analyze_activity(commits, issues),
            "community": self._analyze_community(issues, contributors),
            "maintenance": self._analyze_maintenance(repo_data, issues),
            "documentation": self._analyze_documentation(repo_data),
        }
        
        health["overall"] = self._calculate_overall_score(health)
        
        health["project"] = f"{owner}/{repo}"
        health["url"] = repo_data.get("html_url")
        health["analyzed_at"] = datetime.now(timezone.utc).isoformat()
        
        return health
    
    def _analyze_repo_basics(self, repo: dict) -> dict:
        """Analyze basic repository metrics."""
        stars = repo.get("stargazers_count", 0)
        forks = repo.get("forks_count", 0)
        
        fork_ratio = forks / stars if stars > 0 else 0
        
        return {
            "stars": stars,
            "forks": forks,
            "watchers": repo.get("watchers_count", 0),
            "fork_ratio": round(fork_ratio, 2),
            "is_fork": repo.get("fork", False),
            "is_archived": repo.get("archived", False),
            "is_private": repo.get("private", False),
            "license": repo.get("license", {}).get("name") if repo.get("license") else "None",
            "default_branch": repo.get("default_branch", "main"),
        }
    
    def _analyze_activity(self, commits: List[dict], issues: List[dict]) -> dict:
        """Analyze project activity."""
        now = datetime.now(timezone.utc)
        
        commits_by_month = {}
        for commit in commits:
            date_str = commit.get("commit", {}).get("author", {}).get("date", "")[:10]
            if date_str:
                try:
                    date = datetime.strptime(date_str, "%Y-%m-%d")
                    month_key = date.strftime("%Y-%m")
                    commits_by_month[month_key] = commits_by_month.get(month_key, 0) + 1
                except:
                    pass
        
        recent_commits = 0
        for c in commits:
            date_str = c.get("commit", {}).get("author", {}).get("date", "")[:10]
            if date_str:
                try:
                    date = datetime.strptime(date_str, "%Y-%m-%d")
                    if (now - date).days < 30:
                        recent_commits += 1
                except:
                    pass
        
        issues_this_month = 0
        closed_this_month = 0
        for i in issues:
            created_str = i.get("created_at", "")[:10]
            if created_str:
                try:
                    created = datetime.strptime(created_str, "%Y-%m-%d")
                    if (now - created).days < 30:
                        issues_this_month += 1
                        if i.get("state") == "closed":
                            closed_str = i.get("closed_at", "")[:10]
                            if closed_str:
                                closed = datetime.strptime(closed_str, "%Y-%m-%d")
                                if (now - closed).days < 30:
                                    closed_this_month += 1
                except:
                    pass
        
        commit_score = min(100, recent_commits / 3 * 100)
        issue_score = 50 if issues_this_month == 0 else min(100, closed_this_month / issues_this_month * 100)
        
        return {
            "total_commits": len(commits),
            "commits_this_month": recent_commits,
            "commits_by_month": commits_by_month,
            "total_issues": len(issues),
            "issues_this_month": issues_this_month,
            "closed_this_month": closed_this_month,
            "issue_resolution_rate": round(issue_score, 1),
            "commit_frequency_score": round(commit_score, 1),
            "activity_status": "Very Active" if recent_commits > 20 else "Active" if recent_commits > 5 else "Low Activity"
        }
    
    def _analyze_community(self, issues: List[dict], contributors: List[dict]) -> dict:
        """Analyze community health."""
        now = datetime.now(timezone.utc)
        
        top_contributors = contributors[:10]
        
        issues_with_comments = sum(1 for i in issues if i.get("comments", 0) > 0)
        avg_comments = sum(i.get("comments", 0) for i in issues) / len(issues) if issues else 0
        
        good_first_issues = sum(1 for i in issues for label in i.get("labels", []) 
                                if "good first" in label.get("name", "").lower())
        
        recent_issues = []
        for i in issues:
            created_str = i.get("created_at", "")[:10]
            if created_str:
                try:
                    created = datetime.strptime(created_str, "%Y-%m-%d")
                    if (now - created).days < 90:
                        recent_issues.append(i)
                except:
                    pass
        
        responsive_issues = sum(1 for i in recent_issues if i.get("comments", 0) > 0)
        response_rate = (responsive_issues / len(recent_issues) * 100) if recent_issues else 0
        
        return {
            "total_contributors": len(contributors),
            "top_contributors": [{"login": c.get("login"), "contributions": c.get("contributions")} 
                                for c in top_contributors[:5]],
            "issues_with_engagement": issues_with_comments,
            "avg_comments_per_issue": round(avg_comments, 1),
            "good_first_issues": good_first_issues,
            "response_rate": round(response_rate, 1),
            "newcomer_friendly": good_first_issues > 0 and response_rate > 50,
        }
    
    def _analyze_maintenance(self, repo: dict, issues: List[dict]) -> dict:
        """Analyze maintenance practices."""
        now = datetime.now(timezone.utc)
        
        updated_str = repo.get("updated_at", "")[:10]
        if updated_str:
            try:
                updated_at = datetime.strptime(updated_str, "%Y-%m-%d")
                days_since_update = (now - updated_at).days
            except:
                days_since_update = 365
        else:
            days_since_update = 365
        
        open_issues = [i for i in issues if i.get("state") == "open"]
        
        stale_issues = 0
        very_stale = 0
        for i in open_issues:
            created_str = i.get("created_at", "")[:10]
            if created_str:
                try:
                    created = datetime.strptime(created_str, "%Y-%m-%d")
                    days = (now - created).days
                    if days > 90:
                        stale_issues += 1
                    if days > 180:
                        very_stale += 1
                except:
                    pass
        
        prs = self.github.get_all_pages(f"repos/{repo.get('owner', {}).get('login', '')}/{repo.get('name', '')}/pulls")
        merged_prs = sum(1 for pr in prs if pr.get("merged_at"))
        pr_merge_rate = (merged_prs / len(prs) * 100) if prs else 0
        
        releases = self.github.get_all_pages(f"repos/{repo.get('owner', {}).get('login', '')}/{repo.get('name', '')}/releases")
        
        return {
            "days_since_update": days_since_update,
            "last_updated_status": "Recent" if days_since_update < 7 else "Active" if days_since_update < 30 else "Stale",
            "open_issues": len(open_issues),
            "stale_issues": stale_issues,
            "very_stale_issues": very_stale,
            "stale_issue_percentage": round(stale_issues / len(open_issues) * 100, 1) if open_issues else 0,
            "total_prs": len(prs),
            "merged_prs": merged_prs,
            "pr_merge_rate": round(pr_merge_rate, 1),
            "total_releases": len(releases),
            "has_recent_release": len(releases) > 0 and (
                True if (datetime.now(timezone.utc) - datetime.strptime(releases[0].get("published_at", "")[:10], "%Y-%m-%d")).days < 90
                else False
            ) if releases else False,
        }
    
    def _analyze_documentation(self, repo: dict) -> dict:
        """Analyze documentation quality."""
        return {
            "has_wiki": repo.get("has_wiki", False),
            "has_projects": repo.get("has_projects", False),
            "has_pages": repo.get("has_pages", False),
            "description_length": len(repo.get("description", "") or ""),
            "has_description": bool(repo.get("description")),
        }
    
    def _calculate_overall_score(self, health: dict) -> dict:
        """Calculate overall health score with breakdown."""
        scores = {
            "activity": health["activity"]["commit_frequency_score"],
            "community": health["community"]["response_rate"],
            "maintenance": max(0, 100 - health["maintenance"]["stale_issue_percentage"]),
            "documentation": 50 if health["documentation"]["has_description"] else 20,
        }
        
        weights = {"activity": 0.30, "community": 0.30, "maintenance": 0.25, "documentation": 0.15}
        
        weighted_score = sum(scores[k] * weights[k] for k in scores)
        
        return {
            "score": round(weighted_score, 1),
            "breakdown": {k: round(v, 1) for k, v in scores.items()},
            "grade": "A" if weighted_score >= 80 else "B" if weighted_score >= 60 else "C" if weighted_score >= 40 else "D",
            "status": "Healthy" if weighted_score >= 70 else "Needs Attention" if weighted_score >= 40 else "At Risk"
        }


class HealthDisplay:
    """Display health analysis results."""
    
    def __init__(self, console_obj: Console):
        self.console = console_obj
    
    def display(self, health: dict):
        """Display complete health analysis."""
        if not health:
            return
        
        project = health["project"]
        overall = health["overall"]
        
        grade_colors = {"A": "bold green", "B": "green", "C": "yellow", "D": "bold red"}
        grade_color = grade_colors.get(overall["grade"], "white")
        
        header = f"""
[bold cyan]🏥 Project Health Report[/bold cyan]

[bold]{project}[/bold]
[link={health['url']}]{health['url']}[/link]

[bold]Overall Score:[/bold] [{grade_color}]{overall['score']}/100[/{grade_color}] ({overall['grade']})
[bold]Status:[/bold] {overall['status']}
        """
        
        status_colors = {"Healthy": "green", "Needs Attention": "yellow", "At Risk": "red"}
        border_color = status_colors.get(overall["status"], "white")
        
        self.console.print(Panel(header, border_style=border_color))
        
        self._display_activity(health["activity"])
        self._display_community(health["community"])
        self._display_maintenance(health["maintenance"])
        self._display_repo_basics(health["repo"])
        self._display_score_breakdown(overall)
        self._display_recommendations(health)
    
    def _display_activity(self, activity: dict):
        """Display activity metrics."""
        table = Table(show_header=True, header_style="bold blue", box=None)
        table.add_column("Metric", style="cyan", width=25)
        table.add_column("Value", style="white")
        
        table.add_row("📊 Commit Frequency Score", f"{activity['commit_frequency_score']}/100")
        table.add_row("📅 Commits This Month", str(activity["commits_this_month"]))
        table.add_row("📝 Total Issues", str(activity["total_issues"]))
        table.add_row("🐛 Issues This Month", str(activity["issues_this_month"]))
        table.add_row("✅ Closed This Month", str(activity["closed_this_month"]))
        table.add_row("🎯 Issue Resolution Rate", f"{activity['issue_resolution_rate']}%")
        table.add_row("📈 Activity Status", activity["activity_status"])
        
        self.console.print(Panel(table, title="📈 Activity", border_style="blue"))
    
    def _display_community(self, community: dict):
        """Display community metrics."""
        table = Table(show_header=True, header_style="bold green", box=None)
        table.add_column("Metric", style="cyan", width=30)
        table.add_column("Value", style="white")
        
        table.add_row("👥 Total Contributors", str(community["total_contributors"]))
        table.add_row("💬 Response Rate", f"{community['response_rate']}%")
        table.add_row("🐛 Good First Issues", str(community["good_first_issues"]))
        table.add_row("💬 Avg Comments/Issue", str(community["avg_comments_per_issue"]))
        table.add_row("🌟 Newcomer Friendly", "✅ Yes" if community["newcomer_friendly"] else "❌ No")
        
        self.console.print(Panel(table, title="👥 Community", border_style="green"))
    
    def _display_maintenance(self, maintenance: dict):
        """Display maintenance metrics."""
        stale_color = "red" if maintenance["stale_issue_percentage"] > 30 else "yellow" if maintenance["stale_issue_percentage"] > 10 else "green"
        
        table = Table(show_header=True, header_style="bold yellow", box=None)
        table.add_column("Metric", style="cyan", width=25)
        table.add_column("Value", style="white")
        
        table.add_row("⏰ Days Since Update", str(maintenance["days_since_update"]))
        table.add_row("🐛 Open Issues", str(maintenance["open_issues"]))
        table.add_row("⏳ Stale Issues (>90 days)", str(maintenance["stale_issues"]))
        table.add_row(f"📉 Stale Issue %", f"[{stale_color}]{maintenance['stale_issue_percentage']}%[/{stale_color}]")
        table.add_row("🔀 PR Merge Rate", f"{maintenance['pr_merge_rate']}%")
        table.add_row("🏷️ Total Releases", str(maintenance["total_releases"]))
        table.add_row("✨ Recent Release", "✅ Yes" if maintenance["has_recent_release"] else "❌ No")
        
        self.console.print(Panel(table, title="🔧 Maintenance", border_style="yellow"))
    
    def _display_repo_basics(self, repo: dict):
        """Display repository basics."""
        table = Table(show_header=True, header_style="bold cyan", box=None)
        table.add_column("Metric", style="cyan", width=20)
        table.add_column("Value", style="white")
        
        table.add_row("⭐ Stars", f"{repo['stars']:,}")
        table.add_row("🍴 Forks", f"{repo['forks']:,}")
        table.add_row("👁️ Watchers", f"{repo['watchers']:,}")
        table.add_row("📄 License", repo["license"])
        table.add_row("🌿 Default Branch", repo["default_branch"])
        table.add_row("🍴 Is Fork", "✅ Yes" if repo["is_fork"] else "❌ No")
        table.add_row("📁 Is Archived", "⚠️ Yes" if repo["is_archived"] else "❌ No")
        
        self.console.print(Panel(table, title="📦 Repository", border_style="cyan"))
    
    def _display_score_breakdown(self, overall: dict):
        """Display score breakdown."""
        breakdown = overall["breakdown"]
        
        table = Table(show_header=True, header_style="bold magenta", box=None)
        table.add_column("Category", style="cyan", width=20)
        table.add_column("Score", justify="right")
        table.add_column("Visual", width=15)
        
        categories = [
            ("Activity", breakdown["activity"]),
            ("Community", breakdown["community"]),
            ("Maintenance", breakdown["maintenance"]),
            ("Documentation", breakdown["documentation"]),
        ]
        
        for name, score in categories:
            filled = "█" * int(score / 10)
            empty = "░" * (10 - int(score / 10))
            bar = f"[green]{filled}[/green][dim]{empty}[/dim]"
            table.add_row(name, f"{score}%", bar)
        
        self.console.print(Panel(table, title="📊 Score Breakdown", border_style="magenta"))
    
    def _display_recommendations(self, health: dict):
        """Display recommendations based on health analysis."""
        recs = []
        
        if health["activity"]["commits_this_month"] < 5:
            recs.append("🔴 Increase commit activity - project appears inactive")
        
        if health["community"]["response_rate"] < 50:
            recs.append("🔴 Improve issue response rate - responders are slow")
        
        if health["community"]["good_first_issues"] == 0:
            recs.append("🟡 Add 'good first issue' labels to attract contributors")
        
        if health["maintenance"]["stale_issue_percentage"] > 30:
            recs.append("🔴 Address stale issues - many issues are being ignored")
        
        if not health["maintenance"]["has_recent_release"]:
            recs.append("🟡 Consider creating a release to show active maintenance")
        
        if health["documentation"]["description_length"] < 50:
            recs.append("🟡 Improve repository description")
        
        if not recs:
            recs.append("✅ Project looks healthy! Keep up the good work.")
        
        rec_text = "\n".join(f"  • {r}" for r in recs)
        
        self.console.print(Panel(f"\n{rec_text}\n", title="💡 Recommendations", border_style="blue"))


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="🌍 OSS Marketplace - Project Health Checker",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --owner facebook --repo react
  %(prog)s facebook react
  %(prog)s facebook/react --json
        """
    )
    
    parser.add_argument("--version", action="version", version=f"%(prog)s {VERSION}")
    parser.add_argument("--owner", help="Repository owner")
    parser.add_argument("--repo", help="Repository name")
    parser.add_argument("--token", help="GitHub token")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    
    args = parser.parse_args()
    
    owner = args.owner
    repo = args.repo
    
    if not owner or not repo:
        if len(sys.argv) > 1 and "/" in sys.argv[-1]:
            parts = sys.argv[-1].split("/")
            owner, repo = parts[-2], parts[-1]
        else:
            parser.print_help()
            sys.exit(1)
    
    github = GitHubClient(token=args.token)
    analyzer = HealthAnalyzer(github)
    display = HealthDisplay(console)
    
    health = analyzer.analyze_project(owner, repo)
    
    if health:
        if args.json:
            print(json.dumps(health, indent=2))
        else:
            display.display(health)


if __name__ == "__main__":
    main()
