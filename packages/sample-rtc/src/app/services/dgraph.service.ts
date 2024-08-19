import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DgraphService {
  url = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  async query<T>(str: string) {
    const data = await firstValueFrom(
      this.http.post<Query<T>>(`${this.url}/query`, str, {
        headers: { 'content-type': 'application/dql' },
      }),
    );
    return data;
  }

  async mutate(obj: object, _delete = false) {
    const data = await firstValueFrom(
      this.http.post<Mutate>(
        `${this.url}/mutate?commitNow=true`,
        {
          ...(_delete ? { delete: obj } : { set: obj }),
        },
        { headers: { 'content-type': 'application/json' } },
      ),
    );

    return data.data.uids;
  }
}

type Mutate = {
  data: { code: string; message: string; uids: Record<string, string> };
};

type Query<T> = {
  data: {
    [key: string]: T[];
  };
};
