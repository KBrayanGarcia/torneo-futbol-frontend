import type { Match, Tournament, MatchStatus, Team } from "../types";

// Helper for YYYY-MM-DD parsing in Local Time, setting 18:00 to avoid timezone shifts
export const parseLocalDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    // Set to 18:00 (6 PM) to be safe from midnight timezone shifts in Americas
    return new Date(y, m - 1, d, 18, 0, 0);
};

export const generateFixture = (tournament: Tournament): Match[] => {
    if (tournament.config.type === 'LEAGUE') {
        return generateLeagueFixture(tournament);
    } else {
        return generateCupFixture(tournament);
    }
};

const generateLeagueFixture = (tournament: Tournament): Match[] => {
    const teams = [...tournament.participants];
    const { config } = tournament;

    // Validate teams count
    if (teams.length < 2) return [];

    // Add dummy team if odd
    if (teams.length % 2 !== 0) {
        teams.push({ id: 'BYE', name: 'BYE', players: [], isFixed: false });
    }

    const numTeams = teams.length;
    const rounds = numTeams - 1;
    const half = numTeams / 2;

    let roundPairings: { round: number; home: Team; away: Team }[] = [];

    // Round Robin implementation
    for (let round = 0; round < rounds; round++) {
        for (let i = 0; i < half; i++) {
            const home = teams[i];
            const away = teams[numTeams - 1 - i];

            if (home.id !== 'BYE' && away.id !== 'BYE') {
                roundPairings.push({
                    round: round + 1,
                    // Alternate home/away based on round for fairness
                    home: (round + i) % 2 === 0 ? home : away,
                    away: (round + i) % 2 === 0 ? away : home,
                });
            }
        }
        // Rotate
        teams.splice(1, 0, teams.pop()!);
    }

    // Return Leg logic
    if (config.hasReturnLeg) {
        const returnLegs = roundPairings.map(p => ({
            round: p.round + rounds,
            home: p.away,
            away: p.home
        }));
        roundPairings = [...roundPairings, ...returnLegs];
    }

    // Sort by round
    roundPairings.sort((a, b) => a.round - b.round);

    // --- Scheduling Logic ---
    let matches: Match[] = [];

    // Calculate available dates
    const availableDates: Date[] = [];
    let startDate = new Date();

    if (config.startDate) {
        // Manual parse to avoid timezone issues with YYYY-MM-DD string
        const [y, m, d] = config.startDate.split('-').map(Number);
        startDate = new Date(y, m - 1, d, 18, 0, 0); // 18:00 PM Safe Time
    } else {
        startDate.setHours(18, 0, 0, 0);
    }

    const endDate = config.endDate ? new Date(config.endDate + 'T23:59:59') : null;
    const excludedDays = config.excludedDays || []; // 0=Sun, 6=Sat

    // Generate pool of valid dates (up to enough covers or EndDate)
    // We aim to generate enough dates for all rounds, or respect end date
    const iteratorDate = new Date(startDate);
    const maxDays = 365; // Safety break
    let daysCount = 0;

    while (daysCount < maxDays) {
        // If we have an end date and passed it, stop finding new dates
        // BUT if we don't have enough dates for rounds, we might need to squeeze?
        // Let's Respect End Date strictly if present.
        if (endDate && iteratorDate > endDate) break;

        // Check if excluded
        if (!excludedDays.includes(iteratorDate.getDay())) {
            availableDates.push(new Date(iteratorDate));
        }

        // Next day
        iteratorDate.setDate(iteratorDate.getDate() + 1);
        daysCount++;

        // Heuristic: If we have enough dates for 2x rounds, we arguably have enough pool
        // unless constrained by EndDate.
        if (!endDate && availableDates.length > rounds * 2) break;
    }

    // Default if no valid dates found (e.g. range too short)
    if (availableDates.length === 0) availableDates.push(startDate);

    // Distribute Matches
    // Strategy: Assign matches to dates.
    // Daily Mode: Try to play 1 Round per Available Day.
    // Distributed: Spread all matches evenly across all available dates.

    if (config.schedulingMode === 'DAILY_FOR_ALL') {
        // 1 Round per Date
        matches = roundPairings.map((p) => {
            // Round 1 -> Date index 0
            // Round N -> Date index N-1
            const dateIndex = (p.round - 1) % availableDates.length;
            const matchDate = new Date(availableDates[dateIndex]);

            // Set Time: Stagger matches in the day?
            // e.g. 10:00, 11:00, 12:00
            // Find which match number this is within the round
            // We can't easily know "index within round" without grouping first.
            // Simple hack: use global index modulo matchesPerRound
            // But roundPairings is sorted by round.
            // So logic holds.
            // User requested 18:00 fixed time for now
            matchDate.setHours(18, 0, 0);

            return {
                id: crypto.randomUUID(),
                tournamentId: tournament.id,
                homeTeamId: p.home.id,
                awayTeamId: p.away.id,
                date: matchDate.toISOString(),
                status: 'SCHEDULED',
                round: p.round
            };
        });
    } else {
        // Distributed Mode (Space out)
        // Total Matches / Total Dates
        const totalMatches = roundPairings.length;
        const totalDates = availableDates.length;
        const matchesPerDay = Math.ceil(totalMatches / totalDates); // e.g. 2 matches/day

        matches = roundPairings.map((p, index) => {
            const dayIndex = Math.floor(index / matchesPerDay) % totalDates;
            const matchDate = new Date(availableDates[dayIndex]);

            // Time staggering within the day
            // User requested 18:00 fixed time
            matchDate.setHours(18, 0, 0);

            return {
                id: crypto.randomUUID(),
                tournamentId: tournament.id,
                homeTeamId: p.home.id,
                awayTeamId: p.away.id,
                date: matchDate.toISOString(),
                status: 'SCHEDULED',
                round: p.round
            };
        });
    }

    return matches;
};

const generateCupFixture = (tournament: Tournament): Match[] => {
    // TODO: Implement Cup bracket generation
    // Simple random pairing for first round
    const teams = [...tournament.participants].sort(() => 0.5 - Math.random());
    const matches: Match[] = [];

    // Determine bracket size (next power of 2)
    // For now, just pair them up. Handling byes properly is complex.

    while (teams.length >= 2) {
        const home = teams.pop()!;
        const away = teams.pop()!;

        matches.push({
            id: crypto.randomUUID(),
            tournamentId: tournament.id,
            homeTeamId: home.id,
            awayTeamId: away.id,
            date: new Date().toISOString(),
            status: 'SCHEDULED' as MatchStatus,
            phase: 'Round 1' // Should be calculated based on team count
        });
    }

    // If one team left, they get a bye (not handled here yet)

    return matches;
};

export const calculateStandings = (participants: Team[], matches: Match[]): Team[] => {
    // Initialize stats for all teams by CLONING and resetting stats
    // We cannot mutate the store objects directly if used inside a component render without care
    const standings = participants.map(team => ({
        ...team,
        stats: {
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsScored: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0
        }
    }));

    // Process matches
    matches.forEach(match => {

        if (match.status === 'PLAYED' && match.score) {
            // Backend might send homeTeam object but not homeTeamId property directly
            const homeId = match.homeTeamId || match.homeTeam?.id;
            const awayId = match.awayTeamId || match.awayTeam?.id;

            const home = standings.find(t => t.id === homeId);
            const away = standings.find(t => t.id === awayId);

            if (home && away && home.stats && away.stats) {
                // Ensure scores are numbers
                const homeScore = Number(match.score.home);
                const awayScore = Number(match.score.away);

                if (isNaN(homeScore) || isNaN(awayScore)) return;

                // Update Goals
                home.stats.goalsScored += homeScore;
                home.stats.goalsAgainst += awayScore;
                away.stats.goalsScored += awayScore;
                away.stats.goalsAgainst += homeScore;

                // Update Matches Played
                home.stats.matchesPlayed += 1;
                away.stats.matchesPlayed += 1;

                // Update Result
                if (homeScore > awayScore) {
                    home.stats.wins += 1;
                    home.stats.points += 3;
                    away.stats.losses += 1;
                } else if (homeScore < awayScore) {
                    away.stats.wins += 1;
                    away.stats.points += 3;
                    home.stats.losses += 1;
                } else {
                    home.stats.draws += 1;
                    home.stats.points += 1;
                    away.stats.draws += 1;
                    away.stats.points += 1;
                }
            }
        }
    });

    // Calculate Goal Difference and Initial Sort needed for standard metrics
    const sortedByStats = standings.map(team => {
        if (team.stats) {
            team.stats.goalDifference = team.stats.goalsScored - team.stats.goalsAgainst;
        }
        return team;
    });

    // Custom Sort Comparator with H2H
    return sortedByStats.sort((a, b) => {
        const statsA = a.stats!;
        const statsB = b.stats!;

        // 1. Points
        if (statsA.points !== statsB.points) return statsB.points - statsA.points;

        // 2. Head-to-Head (H2H)
        // Find match between A and B
        const matchH2H = matches.find(m =>
            (m.homeTeamId === a.id && m.awayTeamId === b.id) ||
            (m.homeTeamId === b.id && m.awayTeamId === a.id)
        );

        if (matchH2H && matchH2H.status === 'PLAYED' && matchH2H.score) {
            // Determine winner of H2H
            let pointsA_H2H = 0;
            let pointsB_H2H = 0;

            if (matchH2H.homeTeamId === a.id) {
                if (matchH2H.score.home > matchH2H.score.away) pointsA_H2H = 3;
                else if (matchH2H.score.home < matchH2H.score.away) pointsB_H2H = 3;
                else { pointsA_H2H = 1; pointsB_H2H = 1; }
            } else {
                if (matchH2H.score.away > matchH2H.score.home) pointsA_H2H = 3;
                else if (matchH2H.score.away < matchH2H.score.home) pointsB_H2H = 3;
                else { pointsA_H2H = 1; pointsB_H2H = 1; }
            }

            if (pointsA_H2H !== pointsB_H2H) return pointsB_H2H - pointsA_H2H;

            // If H2H was draw (or 2 legs equal points), continue to GD
            // (Full H2H logic with away goals etc is complex, sticking to simple points/result)
        }

        // 3. Goal Difference
        if (statsA.goalDifference !== statsB.goalDifference) return statsB.goalDifference - statsA.goalDifference;

        // 4. Goals Scored
        return statsB.goalsScored - statsA.goalsScored;
    });
};
