document.addEventListener("DOMContentLoaded", () => {
  const checklistEl = document.getElementById("checklist");
  const broadGoalsEl = document.getElementById("broadGoals");
  const newItemInput = document.getElementById("newItemInput");
  const newGoalInput = document.getElementById("newGoalInput");
  const motivationInput = document.getElementById("motivationInput");
  const clearBtn = document.getElementById("clearBtn");
  const markAllDoneBtn = document.getElementById("markAllDoneBtn");
  const titleEl = document.getElementById("title");
  const dailyResetEl = document.getElementById("dailyReset");
  const dateSpan = document.getElementById("dateSpan");
  const itemCountEl = document.getElementById("itemCount");
  const themeToggle = document.getElementById("themeToggle");

  const defaultState = {
    title: "Today",
    items: [],
    broadGoals: [],
    motivation: "",
    dailyReset: true,
    lastResetDate: null,
    theme: "system",
  };

  function getState() {
    const savedState = NTLStorage.loadState();
    if (!savedState) return defaultState;

    if (!savedState.broadGoals) {
      savedState.broadGoals = [];
    }

    if (savedState.motivation === undefined) {
      savedState.motivation = "";
    }

    setState(savedState);
    return savedState;
  }

  function setState(state) {
    NTLStorage.saveState(state);
  }

  function renderDate() {
    const now = new Date();
    const opts = { weekday: "short", month: "short", day: "numeric" };
    dateSpan.textContent = now.toLocaleDateString(undefined, opts);
  }

  function renderItemCount() {
    const s = getState();
    const total = s.items.length;
    const completed = s.items.filter((item) => item.done).length;

    if (total === 0) {
      itemCountEl.textContent = "";
      itemCountEl.style.display = "none";
    } else {
      itemCountEl.textContent = `${completed}/${total}`;
      itemCountEl.style.display = "inline-block";
    }
  }

  function renderMarkAllDoneButton() {
    const s = getState();
    const hasIncompleteItems = s.items.some((item) => !item.done);
    const hasItems = s.items.length > 0;

    if (!hasItems) {
      markAllDoneBtn.style.display = "none";
    } else {
      markAllDoneBtn.style.display = "inline-block";
      markAllDoneBtn.textContent = hasIncompleteItems
        ? "Mark All Done"
        : "Unmark All";
    }
  }

  function renderMotivation() {
    const s = getState();
    motivationInput.value = s.motivation || "";
  }

  function applyTheme(theme) {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    let final = "light";
    if (theme === "system") final = prefersDark ? "dark" : "light";
    else final = theme;
    document.documentElement.setAttribute("data-theme", final);
    themeToggle.checked = final === "dark";
  }

  function renderChecklist() {
    const s = getState();
    checklistEl.innerHTML = "";
    for (const it of s.items) {
      const li = document.createElement("li");
      li.className = "item" + (it.done ? " done" : "");
      const cb = document.createElement("span");
      cb.className = "checkbox" + (it.done ? " checked" : "");
      cb.dataset.id = it.id;
      cb.addEventListener("click", toggleItem);
      li.appendChild(cb);
      const txt = document.createElement("div");
      txt.contentEditable = true;
      txt.innerText = it.text;
      txt.addEventListener("input", (e) => {
        updateItemText(it.id, e.target.innerText);
      });
      txt.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          const newId = addItem("");
          requestAnimationFrame(() => {
            const newCheckbox = document.querySelector(
              `#checklist li.item .checkbox[data-id="${newId}"]`
            );
            if (newCheckbox) {
              const editable = newCheckbox.parentElement.querySelector(
                "div[contenteditable='true']"
              );
              if (editable) {
                editable.focus();
              }
            }
          });
        }
      });
      li.appendChild(txt);
      checklistEl.appendChild(li);
    }
  }

  function renderBroadGoals() {
    const s = getState();
    broadGoalsEl.innerHTML = "";
    for (const goal of s.broadGoals) {
      const li = document.createElement("li");
      li.className = "item" + (goal.done ? " done" : "");
      const cb = document.createElement("span");
      cb.className = "checkbox" + (goal.done ? " checked" : "");
      cb.dataset.id = goal.id;
      cb.addEventListener("click", toggleGoal);
      li.appendChild(cb);
      const txt = document.createElement("div");
      txt.contentEditable = true;
      txt.innerText = goal.text;
      txt.addEventListener("input", (e) => {
        updateGoalText(goal.id, e.target.innerText);
      });
      li.appendChild(txt);
      broadGoalsEl.appendChild(li);
    }
  }

  function render() {
    const s = getState();
    titleEl.textContent = s.title || "Today";
    dailyResetEl.checked = !!s.dailyReset;
    applyTheme(s.theme || "system");
    renderChecklist();
    renderBroadGoals();
    renderMotivation();
    renderDate();
    renderItemCount();
    renderMarkAllDoneButton();
  }

  function toggleItem(e) {
    const id = e.target.dataset.id;
    const s = getState();
    const idx = s.items.findIndex((x) => x.id === id);
    if (idx === -1) return;
    s.items[idx].done = !s.items[idx].done;
    setState(s);
    render();
  }

  function updateItemText(id, text) {
    const s = getState();
    const idx = s.items.findIndex((x) => x.id === id);
    if (idx === -1) return;
    s.items[idx].text = text;
    setState(s);
  }

  function toggleGoal(e) {
    const id = e.target.dataset.id;
    const s = getState();
    const idx = s.broadGoals.findIndex((x) => x.id === id);
    if (idx === -1) return;
    s.broadGoals[idx].done = !s.broadGoals[idx].done;
    setState(s);
    render();
  }

  function updateGoalText(id, text) {
    const s = getState();
    const idx = s.broadGoals.findIndex((x) => x.id === id);
    if (idx === -1) return;
    s.broadGoals[idx].text = text;
    setState(s);
  }

  newItemInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && newItemInput.value.trim()) {
      addItem(newItemInput.value.trim());
      newItemInput.value = "";
    }
  });

  newGoalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && newGoalInput.value.trim()) {
      addGoal(newGoalInput.value.trim());
      newGoalInput.value = "";
    }
  });

  function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"; // Max height of 100px
  }

  motivationInput.addEventListener("input", (e) => {
    const s = getState();
    s.motivation = e.target.value;
    setState(s);

    autoResizeTextarea(e.target);
  });

  function renderMotivation() {
    const s = getState();
    motivationInput.value = s.motivation || "";
    setTimeout(() => autoResizeTextarea(motivationInput), 0);
  }

  function addItem(text) {
    const s = getState();
    const newId = "i" + Date.now() + Math.random().toString(36).slice(2, 6);
    s.items.unshift({ id: newId, text, done: false });
    setState(s);
    render();
    return newId;
  }

  function addGoal(text) {
    const s = getState();
    s.broadGoals.unshift({
      id: "g" + Date.now() + Math.random().toString(36).slice(2, 6),
      text,
      done: false,
    });
    setState(s);
    render();
  }

  markAllDoneBtn.addEventListener("click", markAllDone);

  clearBtn.addEventListener("click", () => {
    if (!confirm("Clear all daily checklist items?")) return;
    const s = getState();
    s.items = [];
    s;
    setState(s);
    render();
  });

  titleEl.addEventListener("input", () => {
    const s = getState();
    s.title = titleEl.textContent;
    setState(s);
  });

  function checkDailyReset() {
    const s = getState();
    if (!s.dailyReset) return;
    const today = new Date().toISOString().slice(0, 10);
    if (s.lastResetDate !== today) {
      s.items = [];
      s.lastResetDate = today;
      setState(s);
      render();
    }
  }

  dailyResetEl.addEventListener("change", (e) => {
    const s = getState();
    s.dailyReset = e.target.checked;
    setState(s);
  });

  themeToggle.addEventListener("change", (e) => {
    const s = getState();
    s.theme = e.target.checked ? "dark" : "light";
    setState(s);
    applyTheme(s.theme);
  });

  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        const s = getState();
        if (s.theme === "system") applyTheme("system");
      });
  }

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        const newId = addItem("");
        requestAnimationFrame(() => {
          const newLi = document.querySelector(
            `#checklist li.item .checkbox[data-id="${newId}"]`
          );
          if (newLi) {
            const editable = newLi.parentElement.querySelector(
              "div[contenteditable='true']"
            );
            if (editable) {
              editable.focus();
              const range = document.createRange();
              range.selectNodeContents(editable);
              range.collapse(false);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } else {
            newItemInput.focus();
          }
        });
        return;
      }

      if (
        e.key === "Delete" &&
        document.activeElement.contentEditable === "true"
      ) {
        const activeItem = document.activeElement.closest("li.item");
        if (activeItem) {
          const checkbox = activeItem.querySelector(".checkbox");
          if (checkbox) {
            const id = checkbox.dataset.id;
            if (id.startsWith("i")) {
              e.preventDefault();
              removeItem(id);
            }
          }
        }
        return;
      }

      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        clearBtn.click();
        return;
      }

      if (e.key === "Escape") {
        if (document.activeElement.contentEditable === "true") {
          e.preventDefault();
          document.activeElement.blur();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        markAllDone();
        return;
      }
    },
    true
  );

  function removeItem(id) {
    const s = getState();
    s.items = s.items.filter((item) => item.id !== id);
    setState(s);
    render();
  }

  function removeGoal(id) {
    const s = getState();
    s.broadGoals = s.broadGoals.filter((goal) => goal.id !== id);
    setState(s);
    render();
  }

  function markAllDone() {
    const s = getState();
    const hasIncompleteItems = s.items.some((item) => !item.done);

    if (!hasIncompleteItems) {
      s.items.forEach((item) => (item.done = false));
    } else {
      s.items.forEach((item) => (item.done = true));
    }

    setState(s);
    render();
  }

  checkDailyReset();
  render();

  newItemInput.focus();

  setInterval(checkDailyReset, 60 * 1000);
});
