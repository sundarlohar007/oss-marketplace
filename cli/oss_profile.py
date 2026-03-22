#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OSS Marketplace CLI - Contributor Profile Generator
Main entry point for the CLI tool
"""

import argparse
import sys
import json
import io
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "rich", "requests"])
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress

import requests

console = Console()

GITHUB_API = "https://api.github.com"


def get_github_data(username: str) -> dict:
    """Fetch user data from GitHub API."""
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    with Progress() as progress:
        task = progress.add_task(f"[cyan]Fetching data for @{username}...", total=100)
        
        # Get user profile
        progress.update(task, advance=20)
        user_resp = requests.get(f"{GITHUB_API}/users/{username}", headers=headers)
        
        if user_resp.status_code == 404:
            console.print(f"[red]❌ User @{username} not found![/red]")
            sys.exit(1)
        
        user_data = user_resp.json()
        progress.update(task, advance=30)
        
        # Get repositories
        repos_resp = requests.get(f"{GITHUB_API}/users/{username}/repos", headers=headers, params={"per_page": 100})
        repos = repos_resp.json() if repos_resp.status_code == 200 else []
        progress.update(task, advance=30)
        
        # Get events
        events_resp = requests.get(f"{GITHUB_API}/users/{username}/events", headers=headers, params={"per_page": 100})
        events = events_resp.json() if events_resp.status_code == 200 else []
        progress.update(task, advance=20)
    
    return {
        "user": user_data,
        "repos": repos,
        "events": events
    }


def analyze_languages(repos: list) -> dict:
    """Analyze programming languages used across repositories."""
    languages = {}
    for repo in repos:
        if repo.get("language"):
            languages[repo["language"]] = languages.get(repo["language"], 0) + 1
    
    total = sum(languages.values())
    percentages = {
        lang: round((count / total) * 100, 1) 
        for lang, count in sorted(languages.items(), key=lambda x: x[1], reverse=True)
    }
    
    return percentages


def calculate_activity_level(events: list) -> str:
    """Calculate activity level based on events."""
    weekly_events = len(events) / 52  # Rough estimate
    
    if weekly_events > 10:
        return "🔥 Very High"
    elif weekly_events > 5:
        return "⚡ High"
    elif weekly_events > 1:
        return "📈 Medium"
    elif weekly_events > 0.1:
        return "📉 Low"
    else:
        return "💤 Minimal"


def generate_profile(data: dict, username: str) -> dict:
    """Generate contributor DNA profile."""
    user = data["user"]
    repos = data["repos"]
    events = data["events"]
    
    # Analyze languages
    languages = analyze_languages(repos)
    top_languages = list(languages.keys())[:5]
    
    # Analyze repo types
    public_repos = [r for r in repos if not r.get("private")]
    fork_repos = [r for r in repos if r.get("fork")]
    
    # Calculate stars and forks
    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    total_forks = sum(r.get("forks_count", 0) for r in repos)
    
    profile = {
        "username": username,
        "name": user.get("name") or username,
        "bio": user.get("bio") or "No bio provided",
        "location": user.get("location") or "Unknown",
        "company": user.get("company") or "Independent",
        "website": user.get("blog") or "",
        "twitter": user.get("twitter_username") or "",
        "joined": user.get("created_at", "")[:10],
        
        # Technical DNA
        "languages": languages,
        "top_languages": top_languages,
        "total_repos": len(repos),
        "public_repos": len(public_repos),
        "forked_repos": len(fork_repos),
        "total_stars": total_stars,
        "total_forks": total_forks,
        
        # Activity signals
        "followers": user.get("followers", 0),
        "following": user.get("following", 0),
        "activity_level": calculate_activity_level(events),
        "event_count": len(events),
        
        # Community signals
        "has_bio": bool(user.get("bio")),
        "has_location": bool(user.get("location")),
        "has_website": bool(user.get("blog")),
        "is_verified": user.get("site_admin", False),
        
        # Generated at
        "generated_at": str(Path.cwd()),
        "version": "1.0.0"
    }
    
    return profile


def save_profile(profile: dict, output_file: str = None):
    """Save profile to JSON file."""
    if output_file is None:
        output_file = f"profile_{profile['username']}.json"
    
    with open(output_file, "w") as f:
        json.dump(profile, f, indent=2)
    
    console.print(f"[green]✅ Profile saved to {output_file}[/green]")


def display_profile(profile: dict):
    """Display profile in rich format."""
    console.print("\n")
    console.print(f"[bold cyan]🐙 OSS Contributor DNA: @{profile['username']}[/bold cyan]")
    console.print("=" * 60)
    
    # Basic Info
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("Field", style="cyan")
    table.add_column("Value", style="white")
    
    table.add_row("Name", profile["name"])
    table.add_row("Bio", profile["bio"])
    table.add_row("Location", profile["location"])
    table.add_row("Company", profile["company"])
    table.add_row("Member Since", profile["joined"])
    
    console.print(table)
    
    # Technical DNA
    console.print("\n[bold magenta]💻 Technical DNA[/bold magenta]")
    lang_table = Table(show_header=True, header_style="bold green")
    lang_table.add_column("Language", style="cyan")
    lang_table.add_column("Usage %", style="white")
    
    for lang, pct in list(profile["languages"].items())[:8]:
        lang_table.add_row(lang, f"{pct}%")
    
    console.print(lang_table)
    
    # Stats
    console.print("\n[bold magenta]📊 Stats[/bold magenta]")
    stats_table = Table(show_header=False)
    stats_table.add_column("", style="cyan")
    stats_table.add_column("", style="white")
    
    stats_table.add_row("📦 Total Repos", str(profile["total_repos"]))
    stats_table.add_row("⭐ Total Stars", str(profile["total_stars"]))
    stats_table.add_row("🍴 Total Forks", str(profile["total_forks"]))
    stats_table.add_row("👥 Followers", str(profile["followers"]))
    stats_table.add_row("📈 Activity Level", profile["activity_level"])
    
    console.print(stats_table)
    
    # Match potential
    console.print("\n[bold magenta]🎯 Match Potential[/bold magenta]")
    
    score = 0
    if profile["total_stars"] > 100:
        score += 20
    if profile["public_repos"] > 5:
        score += 20
    if profile["followers"] > 50:
        score += 20
    if profile["has_bio"] and profile["has_location"]:
        score += 20
    if "High" in str(profile["activity_level"]) or "Very High" in str(profile["activity_level"]):
        score += 20
    
    completeness = score
    
    console.print(f"\n[bold]Profile Completeness:[/bold] {completeness}%")
    if completeness >= 60:
        console.print("[green]Match Readiness: Ready to match![/green]")
    else:
        console.print("[yellow]Match Readiness: Add more to your profile[/yellow]")


def main():
    parser = argparse.ArgumentParser(
        description="🌍 OSS Marketplace - Generate your Contributor DNA Profile",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s create --github octocat           Create profile for GitHub user
  %(prog)s create --github octocat --save   Create and save to JSON file
  %(prog)s match --profile profile.json     Find matches for a profile
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Create profile command
    create_parser = subparsers.add_parser("create", help="Create contributor profile")
    create_parser.add_argument("--github", required=True, help="GitHub username")
    create_parser.add_argument("--save", action="store_true", help="Save profile to JSON")
    create_parser.add_argument("--output", help="Output file path")
    
    # Match command
    match_parser = subparsers.add_parser("match", help="Find project matches")
    match_parser.add_argument("--profile", help="Path to profile JSON file")
    match_parser.add_argument("--github", help="GitHub username (alternative to --profile)")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    if args.command == "create":
        console.print(f"[bold green]🔍 Analyzing @{args.github}...[/bold green]\n")
        
        # Fetch data
        data = get_github_data(args.github)
        
        # Generate profile
        profile = generate_profile(data, args.github)
        
        # Display
        display_profile(profile)
        
        # Save if requested
        if args.save:
            save_profile(profile, args.output)
    
    elif args.command == "match":
        if not args.profile and not args.github:
            console.print("[red]❌ Either --profile or --github required[/red]")
            sys.exit(1)
        
        if args.github:
            console.print(f"[bold green]🔍 Creating profile for @{args.github}...[/bold green]\n")
            data = get_github_data(args.github)
            profile = generate_profile(data, args.github)
        else:
            with open(args.profile) as f:
                profile = json.load(f)
        
        console.print("\n[yellow]🎯 Matching feature coming soon![/yellow]")
        console.print(f"[cyan]Your profile shows expertise in: {', '.join(profile['top_languages'][:3])}[/cyan]")
        console.print("[dim]Run this command again in 2 weeks for full matching!][/dim]")


if __name__ == "__main__":
    main()
