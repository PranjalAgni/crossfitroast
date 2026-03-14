<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";

  let athleteData = $state<any>(null);
  let totalCompetitors = $state(0);
  let countryRank = $state(0);
  let totalInCountry = $state(0);
  let roast = $state("");
  let loadingAthlete = $state(true);
  let loadingRoast = $state(false);
  let error = $state("");

  const id = page.params.id;
  const division = page.url.searchParams.get("division") ?? "1";

  function toFlagEmoji(code: string): string {
    return [...code.toUpperCase()]
      .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
      .join("");
  }

  onMount(async () => {
    const res = await fetch(`/api/athlete/${id}?division=${division}`);
    if (!res.ok) {
      error = "Athlete not found.";
      loadingAthlete = false;
      return;
    }
    const data = await res.json();
    athleteData = data.athlete;
    totalCompetitors = data.totalCompetitors;
    countryRank = data.countryRank;
    totalInCountry = data.totalInCountry;
    loadingAthlete = false;
    generateRoast();
  });

  async function generateRoast() {
    loadingRoast = true;
    roast = "";
    const res = await fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athlete: athleteData, totalCompetitors, countryRank, totalInCountry }),
    });
    const data = await res.json();
    roast = data.roast;
    loadingRoast = false;
  }

  function percentile(rank: string, total: number) {
    return Math.round((1 - Number(rank) / total) * 100);
  }

  function scaledLabel(scaled: string) {
    if (scaled === "1") return "Scaled";
    if (scaled === "2") return "Foundations";
    return "Rx";
  }
</script>

<main>
  <div class="topbar">
    <a href="/" class="back">
      <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
        <path
          d="M12 4L6 10L12 16"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Back
    </a>
    <span class="brand">CROSSFIT<span class="red">ROAST</span></span>
  </div>

  {#if loadingAthlete}
    <div class="center">
      <div class="spinner"></div>
    </div>
  {:else if error}
    <div class="center"><p class="error-text">{error}</p></div>
  {:else if athleteData}
    <div class="content">
      <!-- Hero -->
      <div class="athlete-hero">
        <div class="flag-badge">{toFlagEmoji(athleteData.entrant.countryOfOriginCode)}</div>
        <h1>{athleteData.entrant.competitorName}</h1>
        <p class="athlete-meta">
          {#if athleteData.entrant.affiliateName}{athleteData.entrant.affiliateName} ·
          {/if}{athleteData.entrant.countryOfOriginName} · Age {athleteData.entrant.age}
        </p>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-val red">#{parseInt(athleteData.overallRank).toLocaleString()}</span>
          <span class="stat-lbl">Global</span>
        </div>
        <div class="stat">
          <span class="stat-val">Top {percentile(athleteData.overallRank, totalCompetitors)}%</span>
          <span class="stat-lbl">Worldwide</span>
        </div>
        <div class="stat">
          <span class="stat-val red">#{countryRank}</span>
          <span class="stat-lbl"
            >{toFlagEmoji(athleteData.entrant.countryOfOriginCode)} Country</span
          >
        </div>
        <div class="stat">
          <span class="stat-val">{totalCompetitors.toLocaleString()}</span>
          <span class="stat-lbl">Athletes</span>
        </div>
      </div>

      <!-- WOD Scores -->
      <div class="card">
        <h2 class="card-title">WOD Scores</h2>
        <div class="scores">
          {#each athleteData.scores as score}
            <div class="score-row {score.valid !== '1' ? 'missing' : ''}">
              <span class="wod-num">WOD {score.ordinal}</span>
              {#if score.valid === "1"}
                <div class="score-right">
                  <span class="score-val">{score.scoreDisplay}</span>
                  <span
                    class="badge {score.scaled === '1'
                      ? 'scaled'
                      : score.scaled === '2'
                        ? 'foundations'
                        : 'rx'}"
                  >
                    {scaledLabel(score.scaled)}
                  </span>
                  <span class="score-rank">#{parseInt(score.rank).toLocaleString()}</span>
                </div>
              {:else}
                <span class="no-score">No score</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Roast -->
      <div class="card roast-card">
        <h2 class="card-title">The Roast 🔥</h2>
        {#if loadingRoast}
          <div class="roast-loading">
            <div class="spinner"></div>
            <p>Preparing something brutal...</p>
          </div>
        {:else if roast}
          <blockquote class="roast-text">{roast}</blockquote>
        {/if}
      </div>
    </div>
  {/if}
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
    padding-bottom: 3rem;
  }

  .red {
    color: #e50914;
  }

  /* Topbar */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: linear-gradient(to bottom, #000 0%, transparent 100%);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .back {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #ccc;
    text-decoration: none;
    font-size: 0.85rem;
    min-height: 44px;
    padding: 0.5rem 0;
    transition: color 0.15s;
  }

  .back:hover {
    color: #fff;
  }

  .brand {
    font-size: 0.9rem;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* Layout */
  .content {
    max-width: 560px;
    margin: 0 auto;
    padding: 0 1.25rem 1.5rem;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70svh;
  }

  .error-text {
    color: #666;
    font-size: 0.9rem;
  }

  /* Athlete hero */
  .athlete-hero {
    text-align: center;
    padding: 1.5rem 0 2rem;
  }

  .flag-badge {
    font-size: 3rem;
    margin-bottom: 0.75rem;
    display: block;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
  }

  h1 {
    margin: 0 0 0.4rem;
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .athlete-meta {
    margin: 0;
    font-size: 0.82rem;
    color: #777;
    line-height: 1.5;
  }

  /* Stats grid */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }

  .stat {
    background: #1f1f1f;
    border-radius: 4px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .stat-val {
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1;
    color: #fff;
  }

  .stat-val.red {
    color: #e50914;
  }

  .stat-lbl {
    font-size: 0.68rem;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  /* Cards */
  .card {
    background: #1f1f1f;
    border-radius: 4px;
    padding: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .roast-card {
    border-left: 3px solid #e50914;
    border-radius: 0 4px 4px 0;
  }

  .card-title {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #555;
    margin: 0 0 1rem;
  }

  /* Scores */
  .scores {
    display: flex;
    flex-direction: column;
  }

  .score-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem 0;
    border-bottom: 1px solid #2a2a2a;
    gap: 0.5rem;
  }

  .score-row:last-child {
    border-bottom: none;
  }
  .score-row.missing {
    opacity: 0.3;
  }

  .wod-num {
    font-size: 0.75rem;
    font-weight: 700;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }

  .score-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .score-val {
    font-weight: 700;
    font-size: 0.9rem;
  }

  .badge {
    font-size: 0.58rem;
    padding: 2px 7px;
    border-radius: 2px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge.rx {
    background: #0d2e0d;
    color: #4caf50;
  }
  .badge.scaled {
    background: #2e1a0d;
    color: #ff9800;
  }
  .badge.foundations {
    background: #0d1a2e;
    color: #7986cb;
  }

  .score-rank {
    font-size: 0.75rem;
    color: #444;
  }
  .no-score {
    font-size: 0.85rem;
    color: #333;
  }

  /* Roast */
  .roast-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 0;
    color: #555;
    font-size: 0.85rem;
  }

  .roast-text {
    margin: 0 0 1.25rem;
    font-size: 0.97rem;
    line-height: 1.8;
    color: #ccc;
    font-style: italic;
  }

  /* Spinner */
  .spinner {
    width: 28px;
    height: 28px;
    border: 2.5px solid #2a2a2a;
    border-top-color: #e50914;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 1.9rem;
    }
    .stat-val {
      font-size: 1.5rem;
    }
  }
</style>
