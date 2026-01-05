// SYYSTEM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Hide Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 2500);

    // Initial Dashboard Setup
    console.log("ZiMii Helper v4.0.1 Official Connected.");
    console.log("Contact Trace: 0757457453");
});

// NAVIGATION ENGINE
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.content-page');
const viewTitle = document.getElementById('current-view-title');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        
        // Update Sidebar UI
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Update Content UI
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === target) {
                page.classList.add('active');
                viewTitle.innerText = item.querySelector('span').innerText;
            }
        });
    });
});

// THEME ENGINE
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// MASTER PLANNER LOGIC
function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('taskPriority').value;
    const list = document.getElementById('taskList');

    if (input.value.trim() === "") return;

    const li = document.createElement('li');
    li.className = `task-item p-${priority}`;
    li.style.cssText = "background: var(--card-bg); padding: 15px; border-radius: 12px; margin-bottom: 10px; border-left: 5px solid;";
    
    // Priority Colors
    if(priority === 'high') li.style.borderColor = "#f43f5e";
    else if(priority === 'med') li.style.borderColor = "#f59e0b";
    else li.style.borderColor = "#10b981";

    li.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>${input.value} <small>(${priority.toUpperCase()})</small></span>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#f43f5e; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
    `;

    list.prepend(li);
    input.value = "";
    
    // Auto Notification
    new Notification("ZiMii Planner", { body: "New study task added successfully!" });
}

// GLOBAL HELPER
function switchTab(id) {
    const targetItem = document.querySelector(`[data-target="${id}"]`);
    if(targetItem) targetItem.click();
}
