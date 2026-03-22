"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Moon,
  Sun,
  Bell,
  Mail,
  Github,
  Shield,
  Key,
  Globe,
  Palette,
  Smartphone,
  Monitor,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    matches: true,
    weekly: false,
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      
      <div className="pl-60">
        <Topbar title="Settings" subtitle="Manage your preferences" />
        
        <main className="max-w-3xl mx-auto px-6 py-6">
          {/* Appearance */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Appearance</h2>
                <p className="text-sm text-zinc-500">Customize how the app looks</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-3 block">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800 border-2 border-violet-500 rounded-xl">
                    <Monitor className="w-6 h-6 text-zinc-100" />
                    <span className="text-sm font-medium text-zinc-100">Dark</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition-colors">
                    <Sun className="w-6 h-6 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-400">Light</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition-colors">
                    <Smartphone className="w-6 h-6 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-400">System</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Notifications</h2>
                <p className="text-sm text-zinc-500">Configure how you receive updates</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { key: "email", label: "Email notifications", description: "Receive updates via email" },
                { key: "push", label: "Push notifications", description: "Browser push notifications" },
                { key: "matches", label: "New matches", description: "When a new project matches your profile" },
                { key: "weekly", label: "Weekly digest", description: "Summary of your activity" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-zinc-100">{item.label}</div>
                    <div className="text-sm text-zinc-500">{item.description}</div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? "bg-violet-500" : "bg-zinc-700"
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Privacy</h2>
                <p className="text-sm text-zinc-500">Control your privacy settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <div>
                  <div className="font-medium text-zinc-100">Profile visibility</div>
                  <div className="text-sm text-zinc-500">Who can see your profile</div>
                </div>
                <select className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-violet-500">
                  <option>Public</option>
                  <option>Private</option>
                  <option>GitHub Followers</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                <div>
                  <div className="font-medium text-zinc-100">Show contribution stats</div>
                  <div className="text-sm text-zinc-500">Display on your profile</div>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-violet-500 transition-colors">
                  <span className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-zinc-100">Allow matching</div>
                  <div className="text-sm text-zinc-500">Let maintainers find you</div>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-violet-500 transition-colors">
                  <span className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">API Keys</h2>
                <p className="text-sm text-zinc-500">Manage your API access</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                    <Key className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-100">Production Key</div>
                    <div className="text-sm text-zinc-500 font-mono">oss_mkt_••••••••••••••••</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <Button variant="ghost" size="sm" className="text-zinc-400">
                    Rotate
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                    <Key className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-100">Development Key</div>
                    <div className="text-sm text-zinc-500 font-mono">oss_dev_••••••••••••••••</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <Button variant="ghost" size="sm" className="text-zinc-400">
                    Rotate
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Danger Zone</h2>
                <p className="text-sm text-zinc-500">Irreversible actions</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
              <div>
                <div className="font-medium text-zinc-100">Delete account</div>
                <div className="text-sm text-zinc-500">Permanently delete your account and all data</div>
              </div>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                Delete Account
              </Button>
            </div>
          </div>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}
