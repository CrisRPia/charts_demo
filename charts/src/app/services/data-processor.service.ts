import { Injectable } from "@angular/core";
import { z } from "zod";
import { DataMap } from "./data-loader.service";

type Movie = z.infer<DataMap["imdb.json"]>[number];

type ProcessedMovieInformation = {
    runtimeAverage: number;
    runtimeMinimum: number;
    runtimeMaximum: number;
    revenueAverage: number;
    revenueMinimum: number;
    revenueMaximum: number;
    actorCountAverage: number;
    actorCountMinimum: number;
    actorCountMaximum: number;
};

@Injectable({
    providedIn: "root",
})
export class DataProcessorService {
    constructor() {}

    public avg(...values: number[]) {
        if (values.length === 0) {
            return 0;
        }
        return values.reduce((acc, val) => acc + val) / values.length;
    }
    public max = Math.max;
    public min = Math.min;

    public processMovies(data: Movie[]): ProcessedMovieInformation {
        const runtime = data
            .map((d) => d["Runtime (Minutes)"])
            .filter((r) => r !== "");

        const revenue = data
            .map((d) => d["Revenue (Millions)"])
            .filter((r) => r !== "")
            .map((v) => v * 1_000_000);

        const actorCounts = data.map(d => d.Actors.split(',').length);

        return {
            runtimeAverage: this.avg(...runtime),
            runtimeMinimum: this.min(...runtime),
            runtimeMaximum: this.max(...runtime),
            revenueAverage: this.avg(...revenue),
            revenueMinimum: this.min(...revenue),
            revenueMaximum: this.max(...revenue),
            actorCountAverage: this.avg(...actorCounts),
            actorCountMinimum: this.min(...actorCounts),
            actorCountMaximum: this.max(...actorCounts),
        };
    }

    public groupMovies<T>(
        data: Movie[],
        keyExtractor: (val: Movie) => T
    ): Map<T, Movie[]> {
        return data.reduce((acc, movie) => {
            const year = keyExtractor(movie);
            if (!acc.get(year)) {
                acc.set(year, []);
            }
            acc.get(year)?.push(movie);
            return acc;
        }, new Map<T, Movie[]>());
    }

    public processGroupedMovies<T>(data: Map<T, Movie[]>) {
        const output = new Map<
            T,
            { data: Movie[] } & ProcessedMovieInformation
        >();

        for (const [year, movies] of data.entries()) {
            output.set(year, {
                data: movies,
                ...this.processMovies(movies),
            });
        }

        return output;
    }
}
