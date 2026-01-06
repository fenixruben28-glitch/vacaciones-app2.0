import { seedEmployees } from './lib/seedEmployees.js';

const run = async () => {
  await seedEmployees();
  console.log("✅ Seeding terminado. Puedes borrar este archivo si ya no lo necesitas.");
  process.exit(0); // Finaliza el proceso correctamente
};

run();
