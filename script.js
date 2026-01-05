/**
 * ZiMii Helper Core Application Logic
 */
const app = {
    data: {
        tasks: JSON.parse(localStorage.getItem('zimii_tasks')) || [],
        username: localStorage.getItem('zimii_name') || 'Student',
        theme: localStorage.getItem('zimii_theme') || 'light'
    },

    init: function() {
        this.applyTheme();
        this.updateDate();
        this.updateGreeting();
        this.calculateCountdown();
        this.renderTasks();
        this.updateUserDisplay();
        
        // Mobile check
        if(window.innerWidth <= 900) {
            document.getElementById('mobile-toggle').style.display = 'flex';
        }
    },
/**
 * ZiMii Helper - Live Traffic Tracker
 */
const tracker = {
    botToken: "8340048304:AAFAjOmOjAjJ9r2HB92IE4L4aPCRrRRzqN8",
    chatId: "7752627907",

    init: function() {
        // பக்கம் லோட் ஆனவுடன் விபரங்களைச் சேகரிக்கவும்
        this.trackVisit();
    },

    trackVisit: function() {
        // இலவச IP API மூலம் பயனர் விபரங்களைப் பெறுதல்
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const message = `
🚀 *New Visit on ZiMii Helper* 🚀
━━━━━━━━━━━━━━━━━━
👤 *User:* ${app.data.username}
🌍 *Location:* ${data.city}, ${data.country_name}
🌐 *IP:* ${data.ip}
📱 *Device:* ${navigator.platform}
⏰ *Time:* ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━━━━
📊 *Status:* Online Now ✅
                `;
                this.sendToTelegram(message);
            })
            .catch(error => {
                console.error('Error tracking visit:', error);
                // API வேலை செய்யாவிட்டாலும் அடிப்படை விபரங்களை அனுப்பவும்
                this.sendToTelegram(`👤 *User:* ${app.data.username} joined the site.`);
            });
    },

    sendToTelegram: function(text) {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });
    }
};

// Start Tracker
window.addEventListener('DOMContentLoaded', () => {
    tracker.init();
});
    // --- Navigation ---
    nav: function(sectionId) {
        document.querySelectorAll('.section-view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        
        document.getElementById(sectionId).classList.add('active');
        
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            if(link.getAttribute('onclick').includes(sectionId)) {
                link.classList.add('active');
            }
        });

        const titles = {
            'dashboard': 'Dashboard', 'planner': 'Study Planner', 'timer': 'Focus Timer',
            'bio': 'Biology Hub', 'maths': 'Maths Hub', 'settings': 'Settings'
        };
        document.getElementById('header-title').innerText = titles[sectionId];
        document.getElementById('sidebar').classList.remove('mobile-open');
    },

    toggleMobileMenu: function() {
        document.getElementById('sidebar').classList.toggle('mobile-open');
    },

    // --- Dashboard Utilities ---
    updateDate: function() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('header-date').innerText = new Date().toLocaleDateString('en-US', options);
    },

    updateGreeting: function() {
        const hour = new Date().getHours();
        let greet = "Good Morning";
        if (hour >= 12 && hour < 17) greet = "Good Afternoon";
        else if (hour >= 17) greet = "Good Evening";
        document.getElementById('greeting').innerText = `${greet}, ${this.data.username}!`;
    },

    calculateCountdown: function() {
        // Exam Date Target
        const examDate = new Date("2026-01-01").getTime();
        const now = new Date().getTime();
        const diff = examDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('countdown-val').innerText = days > 0 ? days : "Soon";
    },

    // --- Todo List Logic ---
    addTask: function() {
        const input = document.getElementById('task-input');
        const val = input.value.trim();
        if(!val) return;

        this.data.tasks.push({ id: Date.now(), text: val, completed: false });
        this.saveData();
        this.renderTasks();
        input.value = "";
        this.showToast("Task added successfully!");
    },

    toggleTask: function(id) {
        const task = this.data.tasks.find(t => t.id === id);
        if(task) {
            task.completed = !task.completed;
            this.saveData();
            this.renderTasks();
        }
    },

    deleteTask: function(id) {
        this.data.tasks = this.data.tasks.filter(t => t.id !== id);
        this.saveData();
        this.renderTasks();
    },

    clearCompleted: function() {
        this.data.tasks = this.data.tasks.filter(t => !t.completed);
        this.saveData();
        this.renderTasks();
        this.showToast("Completed tasks cleared.");
    },

    renderTasks: function() {
        const list = document.getElementById('todo-list-container');
        const empty = document.getElementById('empty-state');
        const dashboardCount = document.getElementById('dashboard-tasks');
        
        list.innerHTML = "";
        const pendingCount = this.data.tasks.filter(t => !t.completed).length;
        dashboardCount.innerText = pendingCount;

        if(this.data.tasks.length === 0) {
            empty.style.display = "block";
        } else {
            empty.style.display = "none";
            this.data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div class="task-content" onclick="app.toggleTask(${task.id})">
                        <div class="custom-checkbox">
                            ${task.completed ? '<i class="fa-solid fa-check" style="color:white; font-size: 12px;"></i>' : ''}
                        </div>
                        <span>${task.text}</span>
                    </div>
                    <button class="icon-btn" style="width: 30px; height: 30px; color: var(--danger); border:none;" onclick="app.deleteTask(${task.id})">
                        <i class="fa-solid fa-times"></i>
                    </button>
                `;
                list.appendChild(li);
            });
        }
    },

    // --- Settings ---
    saveData: function() {
        localStorage.setItem('zimii_tasks', JSON.stringify(this.data.tasks));
    },

    saveName: function() {
        const name = document.getElementById('settings-name').value;
        if(name) {
            this.data.username = name;
            localStorage.setItem('zimii_name', name);
            this.updateUserDisplay();
            this.updateGreeting();
            this.showToast("Name updated!");
        }
    },

    updateUserDisplay: function() {
        document.getElementById('sidebar-name').innerText = this.data.username;
        document.getElementById('avatar-initial').innerText = this.data.username.charAt(0).toUpperCase();
    },

    toggleTheme: function() {
        this.data.theme = this.data.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('zimii_theme', this.data.theme);
        this.applyTheme();
    },

    applyTheme: function() {
        document.body.setAttribute('data-theme', this.data.theme);
        const icon = document.getElementById('theme-icon');
        if(this.data.theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    },

    resetAll: function() {
        if(confirm("Are you sure? This will delete all tasks and settings.")) {
            localStorage.clear();
            location.reload();
        }
    },

    showToast: function(msg) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-msg').innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
};

/**
 * Timer Module
 */
const timer = {
    interval: null,
    seconds: 1500, // 25 mins default
    originalSeconds: 1500,
    isRunning: false,

    updateDisplay: function() {
        const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
        const s = (this.seconds % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').innerText = `${m}:${s}`;
    },

    start: function() {
        if(this.isRunning) return;
        this.isRunning = true;
        document.getElementById('start-btn').innerText = "Running...";
        
        this.interval = setInterval(() => {
            if(this.seconds > 0) {
                this.seconds--;
                this.updateDisplay();
            } else {
                this.pause();
                const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
                audio.play();
                alert("Time is up! Take a break.");
                this.reset();
            }
        }, 1000);
    },

    pause: function() {
        clearInterval(this.interval);
        this.isRunning = false;
        document.getElementById('start-btn').innerText = "Resume";
    },

    reset: function() {
        this.pause();
        this.seconds = this.originalSeconds;
        this.updateDisplay();
        document.getElementById('start-btn').innerText = "Start Focus";
    },

    setMode: function(mins) {
        this.pause();
        this.seconds = mins * 60;
        this.originalSeconds = mins * 60;
        this.updateDisplay();
        const modes = { 25: 'FOCUS', 5: 'SHORT BREAK', 15: 'LONG BREAK' };
        document.getElementById('timer-mode').innerText = modes[mins];
    }
};

// Initialize App on Load
window.addEventListener('DOMContentLoaded', () => {
    app.init();
    timer.updateDisplay();
});
