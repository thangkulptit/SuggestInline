import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public form: {
    value: string;
    account: string;
  };
  public suggestions: string[];
  public listShop: string[];
  constructor() {
    this.form = {
      value: "",
      account: ""
    };
    this.listShop = [
      'shop acc lmht 69',
      'shop vn',
      'hihi'
    ];
    this.suggestions = [
      "I like to move it move it",
      "I like big butts and I cannot lie",
      "I like it like that",
      "I like turtles",
      "I like the way you move",
      "I love lamp",
      "I love the way you make me feel",
      "I love that thing you do",
      "I love you so much"
    ];
  }
}
