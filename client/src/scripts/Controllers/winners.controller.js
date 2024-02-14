export const getWinners = async (page, limit, sort, order) => {
  try {
    const response = await fetch(`https://async-race-m.vercel.app/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    const result = await response.json();

    return { result, total: response.headers.get('X-Total-Count') };
  } catch (error) {
    return { error };
  }
};

export const getWinner = async (id) => {
  try {
    const response = await fetch(`https://async-race-m.vercel.app/winners/${id}`);
    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export const createWinner = async (winner) => {
  try {
    const response = await fetch('https://async-race-m.vercel.app/winners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner),
    });
    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export const updateWinner = async (winner) => {
  try {
    const response = await fetch(`https://async-race-m.vercel.app/winners/${winner.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wins: winner.wins, time: winner.time }),
    });
    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};
