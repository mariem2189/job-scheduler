import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService implements OnModuleInit {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  onModuleInit() {
    this.initializeScheduler();
  }

  findAll(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create(createJobDto);
    job.lastRun = new Date(0);
    job.nextRun = new Date(Date.now() + this.parseInterval(job.cronTime));
    return this.jobRepository.save(job);
  }
  private calculateNextRun(createJobDto: CreateJobDto): Date {
    const { cronTime: interval } = createJobDto;
    const now = new Date();
    return new Date(now.getTime() + this.parseInterval(interval));
  }
  
  private initializeScheduler() {
    setInterval(async () => {
      const jobs = await this.findAll();
      const now = new Date();

      jobs.forEach(async job => {
        if (job.nextRun <= now) {
          console.log(`Executing job: ${job.name}`);
          job.lastRun = new Date();
          job.nextRun = new Date(now.getTime() + this.parseInterval(job.cronTime));
          await this.jobRepository.save(job);
        }
      });
    }, 60000);
  }

  private parseInterval(interval: string): number {
    const time = parseInt(interval.slice(0, -1));
    const unit = interval.slice(-1);

    switch (unit) {
      case 's': return time * 1000;
      case 'm': return time * 60 * 1000;
      case 'h': return time * 60 * 60 * 1000;
      case 'd': return time * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  }
}
