import { Injectable } from '@angular/core';
import {
  ARTICLES,
  ASSEMBLY,
  COMPANY,
  GEOMETRIES,
  INDUSTRIES,
  JOBS,
  PROCESSES,
  PROJECTS,
  SERVICES,
} from '../../data/catalog';
@Injectable({ providedIn: 'root' })
export class ContentRepository {
  readonly company = COMPANY;
  readonly geometries = GEOMETRIES;
  readonly assembly = ASSEMBLY;
  readonly projects = PROJECTS;
  readonly services = SERVICES;
  readonly processes = PROCESSES;
  readonly industries = INDUSTRIES;
  readonly articles = ARTICLES;
  readonly jobs = JOBS;
}
