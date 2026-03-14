<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let searchTerm = $state("");
  let results = $state<any[]>([]);
  let loading = $state(false);
  let debounceTimer: ReturnType<typeof setTimeout>;
  let roastCount = $state<number | null>(null);

  onMount(async () => {
    const res = await fetch("/api/count");
    const data = await res.json();
    roastCount = data.count;
  });

  function onInput() {
    clearTimeout(debounceTimer);
    if (searchTerm.length < 2) {
      results = [];
      return;
    }
    debounceTimer = setTimeout(async () => {
      loading = true;
      const res = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);
      results = await res.json();
      loading = false;
    }, 300);
  }

  function selectAthlete(athlete: any) {
    goto(`/roast/${athlete.id}?division=${athlete.division_id}`);
  }
</script>

<main>
  <div class="hero">
    <div class="logo">CROSSFIT<span class="red">ROAST</span></div>
    <p class="tagline">Enter your name. Face the truth.</p>

    <div class="search-wrapper">
      <div class="input-row">
        <svg class="search-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.8" />
          <path
            d="M13.5 13.5L17 17"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search your name..."
          bind:value={searchTerm}
          oninput={onInput}
          autocomplete="off"
        />
        {#if loading}
          <div class="spinner"></div>
        {/if}
      </div>

      {#if results.length > 0}
        <ul class="dropdown">
          {#each results as athlete}
            <li>
              <button onclick={() => selectAthlete(athlete)}>
                <span class="result-name">{athlete.name}</span>
                <span class="result-meta"
                  >{athlete.affiliate || "No affiliate"} · {athlete.division_name}</span
                >
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    {#if roastCount !== null && roastCount > 0}
      <p class="counter">🔥 {roastCount.toLocaleString()} athletes roasted</p>
    {/if}
    <p class="disclaimer">2026 CrossFit Open · Powered by AI brutality</p>
  </div>
</main>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background: #141414;
    color: #fff;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  main {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: radial-gradient(ellipse at top, #1a0000 0%, #141414 60%);
  }

  .hero {
    width: 100%;
    max-width: 440px;
    text-align: center;
  }

  .logo {
    font-size: 2.4rem;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    color: #fff;
  }

  .red {
    color: #e50914;
  }

  .tagline {
    color: #999;
    font-size: 0.95rem;
    margin: 0 0 2.5rem;
    letter-spacing: 0.3px;
  }

  .search-wrapper {
    position: relative;
    margin-bottom: 2rem;
  }

  .input-row {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    width: 18px;
    height: 18px;
    color: #666;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.95rem 1rem 0.95rem 2.75rem;
    font-size: 1rem;
    border: 1px solid #333;
    border-radius: 4px;
    background: #2a2a2a;
    color: #fff;
    outline: none;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
    -webkit-appearance: none;
    appearance: none;
  }

  input::placeholder {
    color: #555;
  }

  input:focus {
    border-color: #e50914;
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
  }

  .spinner {
    position: absolute;
    right: 1rem;
    width: 18px;
    height: 18px;
    border: 2px solid #333;
    border-top-color: #e50914;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #1f1f1f;
    border: 1px solid #333;
    border-radius: 4px;
    list-style: none;
    margin: 0;
    padding: 0.4rem;
    z-index: 10;
    text-align: left;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }

  .dropdown li button {
    width: 100%;
    background: none;
    border: none;
    color: #fff;
    padding: 0.75rem 0.875rem;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 3px;
    transition: background 0.1s;
    min-height: 48px;
    text-align: left;
  }

  .dropdown li button:hover,
  .dropdown li button:active {
    background: #2a2a2a;
  }

  .result-name {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .result-meta {
    font-size: 0.75rem;
    color: #666;
  }

  .counter {
    font-size: 0.8rem;
    color: #e50914;
    margin: 0 0 0.5rem;
    font-weight: 600;
  }

  .disclaimer {
    font-size: 0.72rem;
    color: #444;
    margin: 0;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
</style>
