"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  Trash2, 
  MoreVertical, 
  Loader2, 
  CheckCheck,
  Calendar,
  X
} from "lucide-react";
import { 
  mockNotifications, 
  formatDate 
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading local data
    setTimeout(() => {
      setNotifications(mockNotifications.map(n => ({
        ...n,
        // Map types to consistent categories
        category: n.type === 'success' ? 'payment' : n.type === 'warning' ? 'alert' : 'info'
      })));
      setIsLoading(false);
    }, 800);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success("Notification marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info("Notification removed");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Syncing your notifications...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight font-display">Notifications</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Stay updated with your plot status and payment reminders
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-primary hover:bg-primary/10 gap-2 h-11 px-6 rounded-xl border border-primary/20"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              layout
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={cn(
                "group relative border-white/5 bg-card/40 backdrop-blur-md overflow-hidden transition-all duration-300",
                !notification.read && "border-l-4 border-l-primary bg-primary/5 shadow-lg shadow-primary/5"
              )}>
                <CardContent className="p-6">
                  <div className="flex gap-5">
                    {/* Icon Column */}
                    <div className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                      notification.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                      notification.type === 'warning' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                      "bg-blue-500/10 border-blue-500/20 text-blue-500"
                    )}>
                      {notification.type === 'success' && <CheckCircle2 className="h-6 w-6" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-6 w-6" />}
                      {notification.type === 'info' && <Info className="h-6 w-6" />}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 pr-12">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={cn(
                          "text-lg font-bold transition-all",
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.read && <Badge className="bg-primary/20 text-primary border-primary/30 h-5 px-1.5 text-[10px] uppercase font-black">New</Badge>}
                      </div>
                      <p className={cn(
                        "text-sm leading-relaxed mb-4",
                        !notification.read ? "text-muted-foreground" : "text-muted-foreground/60"
                      )}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/40">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notification.createdAt)}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-card/20 rounded-[2rem] border-2 border-dashed border-white/5">
            <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
              <Bell className="h-10 w-10 text-muted-foreground opacity-30" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Inbox is empty</h2>
            <p className="text-muted-foreground text-lg max-w-sm">
              We&apos;ll notify you when there&apos;s an update regarding your land documentation or installments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
