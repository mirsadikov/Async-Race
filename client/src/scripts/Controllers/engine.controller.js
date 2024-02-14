export const startEngine = async (id) => {
  try {
    const response = await fetch(`https://async-race-m.vercel.app/engine?id=${id}&status=started`, {
      method: 'PATCH',
    });

    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export const stopEngine = async (id) => {
  try {
    const response = await fetch(`https://async-race-m.vercel.app/engine?id=${id}&status=stopped`, {
      method: 'PATCH',
    });

    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export const engineStatus = async (id) => {
  try {
    const response = await fetch(`https://async-race-m.vercel.app/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });

    let result;
    if (response.status === 200) result = await response.json();
    else result = 'stopped';

    return { result };
  } catch (error) {
    return { error };
  }
};
