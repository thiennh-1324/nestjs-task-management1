import { User } from 'src/auth/entities/user.entity';
import { AppDataSource } from 'src/config/data-source';
import { Task } from 'src/tasks/entities/task.entity';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to the database.');

    const users = await seedUsers();
    await seedTasks(users);
    await AppDataSource.destroy();
    console.log('Seed data successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

async function seedUsers(): Promise<User[]> {
  const userRepository = AppDataSource.getRepository(User);
  const users: User[] = [];

  for (let i = 0; i < 10; i++) {
    const user = new User({
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });
    await userRepository.save(user);
    users.push(user);
  }
  console.log(`Seeded ${users.length} users success.`);
  return users;
}

async function seedTasks(users: User[]): Promise<Task[]> {
  const taskRepository = AppDataSource.getRepository(Task);
  const tasks: Task[] = [];

  for (let i = 0; i < 30; i++) {
    const task = new Task({
      title: faker.lorem.words(10),
      description: faker.lorem.paragraph(),
      isActive: false,
      user: faker.helpers.arrayElement(users),
    });

    await taskRepository.save(task);
    tasks.push(task);
  }
  console.log(`Seeded ${users.length} tasks success.`);
  return tasks;
}
seed();
