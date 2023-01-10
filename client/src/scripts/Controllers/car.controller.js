export const addCar = async (name, color) => {
  try {
    const car = {
      name,
      color,
    };

    const response = await fetch('http://localhost:3000/garage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });

    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export const getCars = async (page, limit) => {
  try {
    const response = await fetch(`http://localhost:3000/garage?_page=${page}&_limit=${limit}`);
    const result = await response.json();

    return { result, total: response.headers.get('X-Total-Count') };
  } catch (error) {
    return { error };
  }
};

export const getCar = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/garage/${id}`);
    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export const deleteCar = async (id) => {
  try {
    const deletePromises = [
      fetch(`http://localhost:3000/garage/${id}`, { method: 'DELETE' }),
      fetch(`http://localhost:3000/winners/${id}`, { method: 'DELETE' }),
    ];

    await Promise.all(deletePromises).catch((err) => alert(err));

    return { result: 'Car deleted!' };
  } catch (error) {
    return { error };
  }
};

export const updateCar = async (id, name, color) => {
  try {
    const car = {
      name,
      color,
    };

    const response = await fetch(`http://localhost:3000/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });

    const result = await response.json();

    return { result };
  } catch (error) {
    return { error };
  }
};

export const generateCars = async () => {
  const brands = [
    'BMW',
    'Audi',
    'Mercedes',
    'Volkswagen',
    'Porsche',
    'Ferrari',
    'Lamborghini',
    'Maserati',
    'Bugatti',
    'Ford',
    'Chevrolet',
    'Nissan',
    'Toyota',
    'Honda',
    'Hyundai',
    'Kia',
    'Mazda',
    'Mitsubishi',
    'Subaru',
    'Volvo',
    'Opel',
    'Dodge',
    'Jeep',
    'Cadillac',
    'Lincoln',
    'GMC',
    'Infiniti',
    'Lexus',
    'Tesla',
    'Alfa Romeo',
    'Aston Martin',
    'Bentley',
    'Rolls-Royce',
    'McLaren',
    'Hummer',
    'Jaguar',
    'Land Rover',
  ];
  const models = [
    'X5',
    'A6',
    'S-class',
    'Passat',
    '911',
    'F40',
    'Diablo',
    'GranTurismo',
    'Veyron',
    'Mustang',
    'Camaro',
    'Skyline',
    'Supra',
    'Civic',
    'Elantra',
    'Rio',
    'MX-5',
    'Lancer',
    'Impreza',
    'S60',
    'Astra',
    'Charger',
    'Grand Cherokee',
    'Escalade',
    'Navigator',
    'Sierra',
    'QX50',
    'LS',
    'Model S',
  ];
  const cars = [];

  function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  for (let i = 0; i < 100; i += 1) {
    const car = {
      name: `${brands[Math.floor(Math.random() * brands.length)]} ${
        models[Math.floor(Math.random() * models.length)]
      }`,
      color: randomColor(),
    };

    cars.push(car);
  }
  try {
    const result = await Promise.all(cars.map((car) => addCar(car.name, car.color)));
    return { result };
  } catch (error) {
    return { error };
  }
};
