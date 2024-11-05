import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { DataLoaderService, DataMap } from "./services/data-loader.service";
import { DataProcessorService } from "./services/data-processor.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
    title = "charts";
    private readonly _dataLoader = inject(DataLoaderService);
    private readonly _dataProcessor = inject(DataProcessorService);

    async ngOnInit() {
        const data = await this._dataLoader.loadData("imdb.json");
        const processedMovies = this._dataProcessor.processMovies(data);

        console.log(processedMovies);

        const moviesGroupedByYear = this._dataProcessor.groupMovies(
            data,
            (movie) => movie.Year
        );

        const processedMoviesGroupedByYear =
            this._dataProcessor.processGroupedMovies(moviesGroupedByYear);

        console.log(processedMoviesGroupedByYear);

        const moviesGroupedByFirstGenre = this._dataProcessor.groupMovies(
            data,
            (movie) => movie.Genre.split(',')[0]
        );

        console.log(moviesGroupedByFirstGenre);

        const processedMoviesGroupedByGenre =
            this._dataProcessor.processGroupedMovies(moviesGroupedByFirstGenre);

        console.log(processedMoviesGroupedByGenre);
    }
}
