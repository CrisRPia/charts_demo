import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { z } from "zod";

const dataMap = {
    "imdb.json": z.array(
        z.object({
            Rank: z.number(),
            Title: z.coerce.string(),
            Genre: z.string(),
            Description: z.string(),
            Director: z.string(),
            Actors: z.string(),
            Year: z.number(),
            "Runtime (Minutes)": z.number().or(z.literal("")),
            Rating: z.number(),
            Votes: z.number(),
            "Revenue (Millions)": z.number().or(z.literal("")),
            Metascore: z.number().or(z.literal("")),
        })
    ),
} as const satisfies Record<string, z.Schema>;

export type DataMap = typeof dataMap;

@Injectable({
    providedIn: "root",
})
export class DataLoaderService {
    private readonly _http = inject(HttpClient);

    public async loadData<TKey extends keyof DataMap & string>(data: TKey) {
        const result = await firstValueFrom(
            this._http.get(`${data}`, { responseType: "json" })
        );

        return dataMap[data].parse(result);
    }
}
