export class NotificationService {
  private static instance: NotificationService
  private permission: NotificationPermission = 'default'
  private initialized = false

  private constructor() {
    // Don't initialize during SSR
    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private async init() {
    if (this.initialized || typeof window === 'undefined') {
      return
    }

    if ('Notification' in window) {
      this.permission = Notification.permission
      
      if (this.permission === 'default') {
        // Request permission when user first interacts with the app
        document.addEventListener('click', () => {
          this.requestPermission()
        }, { once: true })
      }
    }
    
    this.initialized = true
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window) || this.permission !== 'granted') {
      return
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false,
        ...options
      })

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      // Focus the window when notification is clicked
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  async notifySessionComplete(sessionType: string): Promise<void> {
    const title = 'Pomodoro Session Complete!'
    const body = `${sessionType} session has finished.`
    
    await this.showNotification(title, {
      body,
      tag: 'pomodoro-session',
      data: { sessionType }
    })
  }

  async notifyBreakComplete(): Promise<void> {
    const title = 'Break Time Over!'
    const body = 'Time to get back to work.'
    
    await this.showNotification(title, {
      body,
      tag: 'pomodoro-break',
      data: { sessionType: 'break' }
    })
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  getPermission(): NotificationPermission {
    return this.permission
  }
} 