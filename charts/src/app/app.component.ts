import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
    title = "charts";
    private readonly _http = inject(HttpClient);
    imdb_data: any = undefined;

    async ngOnInit() {
        this._http
            .get("assets/imdb_movie_dataset.csv", { responseType: "text" })
            .subscribe((content) => {
                console.log(content);
            });
    }
}
