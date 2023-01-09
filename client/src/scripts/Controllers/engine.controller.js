export const startEngine = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/engine?id=${id}&status=started`, {
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
    const response = await fetch(`http://localhost:3000/engine?id=${id}&status=stopped`, {
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
    const response = await fetch(`http://localhost:3000/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });

    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};
