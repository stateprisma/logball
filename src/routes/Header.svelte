<script lang="ts">
  let isVisible: boolean = false;
  let threshold: number = 10;

  function handleMouseMove(event: MouseEvent): void {
    const cursorY: number = event.clientY;
    if (cursorY < threshold) {
      isVisible = true;
      threshold = 100;
    } else {
      isVisible = false;
      threshold = 20;
    }
  }

  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  });
</script>

<div class="header {isVisible ? 'visible' : ''}">
  <!-- Left-side links -->
  <div class="nav-links">
    <a href="/docs">Docs</a>
    <a href="/about">About</a>
  </div>

  <!-- Right-side GitHub link -->
  <div class="github">
    <a href="https://github.com/stateprisma/logball" target="_blank" rel="noopener noreferrer">
      <img src="/github.png" alt="GitHub" />
    </a>
  </div>

  <div class="foggy"></div> <!-- Bottom quarter foggy effect -->
</div>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #21252b;
    color: var(--color-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    transition: transform 0.3s ease;
    transform: translateY(-100%);
    z-index: 1000;
    box-sizing: border-box;
  }

  .header.visible {
    transform: translateY(0);
  }

  .nav-links {
    display: flex;
    gap: 20px;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    font-size: 18px;
  }

  .github {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .github img {
    width: 24px;
    height: 24px;
  }

  .foggy {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 25%;
    background: linear-gradient(to top, rgba(26, 29, 33, 0.5), transparent);
  }
</style>
