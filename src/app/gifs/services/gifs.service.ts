import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _apiKey: string = 'Qawm17QI4k1xcrCS3U4Jyk3ooSC4zO7H';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _limit: number = 10;
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial]
  }

  constructor( private http: HttpClient ){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultado')!) || [];
  }

  buscarGifs( query: string = '' ) {

    query = query.trim().toLowerCase();
    if( !this._historial.includes(query) ){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify( this._historial ) )
    }

    const params = new HttpParams()
          .set( 'api_key', this._apiKey )
          .set( 'limit', this._limit.toString() )
          .set('q', query);


    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
      .subscribe( (resp: SearchGifsResponse ) => {
        this.resultados = resp.data;
        localStorage.setItem('resultado', JSON.stringify( this.resultados ) )
      });

  }
}
