"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Shield, Palette, Globe, Download, Trash2, User, Key, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    trending: true,
    saved: false,
  })

  const [preferences, setPreferences] = useState({
    autoSave: true,
    darkMode: true,
    compactView: false,
    showSources: true,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-400 text-lg">Customize your Flash Feed experience</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Display Name</label>
                  <Input
                    placeholder="Your name"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    defaultValue="John Doe"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    defaultValue="john@example.com"
                  />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription className="text-gray-400">Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Theme</div>
                  <div className="text-gray-400 text-sm">Choose your preferred theme</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="border-white/20"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="border-white/20"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Compact View</div>
                  <div className="text-gray-400 text-sm">Show more content in less space</div>
                </div>
                <Switch
                  checked={preferences.compactView}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, compactView: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Show Sources</div>
                  <div className="text-gray-400 text-sm">Display source information in articles</div>
                </div>
                <Switch
                  checked={preferences.showSources}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, showSources: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-400">Control how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Email Notifications</div>
                  <div className="text-gray-400 text-sm">Receive updates via email</div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Push Notifications</div>
                  <div className="text-gray-400 text-sm">Browser push notifications</div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Trending Topics</div>
                  <div className="text-gray-400 text-sm">Get notified about trending news</div>
                </div>
                <Switch
                  checked={notifications.trending}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, trending: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Saved Articles</div>
                  <div className="text-gray-400 text-sm">Updates on your saved content</div>
                </div>
                <Switch
                  checked={notifications.saved}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, saved: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto-save Articles</div>
                  <div className="text-gray-400 text-sm">Automatically save articles you read</div>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoSave: checked }))}
                />
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>

                <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>

                <Button variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API & Integrations */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API & Integrations
              </CardTitle>
              <CardDescription className="text-gray-400">Connect with external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <div className="text-white font-medium">API Access</div>
                  <div className="text-gray-400 text-sm">Generate API keys for external access</div>
                </div>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  Active
                </Badge>
              </div>

              <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                Generate New API Key
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
