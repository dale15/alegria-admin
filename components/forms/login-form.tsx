"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function LoginForm() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email');
        const password = formData.get('password');

        // TODO: connect to auth API
        console.log({email, password});

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                name="password"
                type="password"
                required
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
            </Button>
        </form>
    );
}