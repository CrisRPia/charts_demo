import {
    Component,
    effect,
    ElementRef,
    inject,
    OnInit,
    signal,
    ViewChild,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { DataLoaderService } from "./services/data-loader.service";
import { DataProcessorService } from "./services/data-processor.service";
import { BaseChartDirective, NG_CHARTS_CONFIGURATION } from "ng2-charts";
import {
    BubbleDataPoint,
    Chart,
    ChartData,
    ChartTypeRegistry,
    Point,
    registerables,
} from "chart.js";
import { FormsModule } from "@angular/forms";

Chart.register(...registerables);

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, BaseChartDirective, FormsModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    title = "charts";
    private readonly _dataLoader = inject(DataLoaderService);
    private readonly _dataProcessor = inject(DataProcessorService);
    chartTypes = [
        "polarArea",
        "doughnut",
        "scatter",
        "bubble",
        "radar",
        "line",
        "bar",
        "pie",
    ] as const satisfies (keyof ChartTypeRegistry)[];

    selectedChartType: keyof ChartTypeRegistry = "bar";

    @ViewChild("myCanvas", { static: false })
    canvasRef!: ElementRef<HTMLCanvasElement>;

    chart?: Chart<
        keyof ChartTypeRegistry,
        (number | [number, number] | Point | BubbleDataPoint | null)[],
        unknown
    >;

    public async groupedByYear() {
        if (this.chart !== undefined) {
            this.chart.destroy();
        }
        const data = await this._dataLoader.loadData("imdb.json");

        const moviesGroupedByYear = this._dataProcessor.groupMovies(
            data,
            (movie) => movie.Year
        );

        const processedMoviesGroupedByYear =
            this._dataProcessor.processGroupedMovies(moviesGroupedByYear);

        const entries = Array.from(processedMoviesGroupedByYear.entries());

        const chartData: ChartData = {
            labels: entries.map((e) => e[0]),
            datasets: [
                {
                    label: "Revenue",
                    data: entries.map((e) => e[1].revenueAverage),
                    borderWidth: 1,
                },
            ],
        };

        // Set data to canvas
        this.chart = new Chart(this.canvasRef.nativeElement, {
            data: chartData,
            type: this.selectedChartType,
            options: {
                maintainAspectRatio: false,
            },
        });
    }

    public async groupedByGenre() {
        if (this.chart !== undefined) {
            this.chart.destroy();
        }

        const data = await this._dataLoader.loadData("imdb.json");

        const moviesGroupedByFirstGenre = this._dataProcessor.groupMovies(
            data,
            (movie) => movie.Genre.split(",")[0]
        );

        const processedMoviesGroupedByGenre =
            this._dataProcessor.processGroupedMovies(moviesGroupedByFirstGenre);

        const entries = Array.from(processedMoviesGroupedByGenre.entries());

        const chartData: ChartData = {
            labels: entries.map((e) => e[0]),
            datasets: [
                {
                    label: "Max Revenue",
                    data: entries.map((e) => e[1].revenueMaximum),
                    borderWidth: 1,
                },
                {
                    label: "Avg Revenue",
                    data: entries.map((e) => e[1].revenueAverage),
                    borderWidth: 1,
                },
                {
                    label: "Min revenue",
                    data: entries.map((e) => e[1].revenueMinimum),
                    borderWidth: 1,
                },
            ],
        };

        // Set data to canvas
        this.chart = new Chart(this.canvasRef.nativeElement, {
            data: chartData,
            type: this.selectedChartType,
            options: {
                maintainAspectRatio: false,
            },
        });
    }
}
