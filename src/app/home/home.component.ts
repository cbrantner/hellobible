import { Component, OnInit, OnDestroy, isDevMode } from '@angular/core';
import { Gtag } from 'angular-gtag';
import { ActivatedRoute } from '@angular/router';

declare const fbq: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private gtag: Gtag;
  public selectedOptions: object;
  public message: string = "";
  private sub: any;
  private utm_source: string = "";
  private utm_medium: string = "";
  private utm_campaign: string = "";
  private utm_term: string = "";
  private utm_content: string = "";

  private campaigns = {
    "a56d739d32-GIFT_EMAIL_2018_11_15": "1 Month FREE. 6 months subscription for one child $99. Use code GIFT6.<br/>3 Months FREE. 12 months subscription for one child $178. Use code GIFT12.",
    "christmas": "Order today and get $5 OFF your Christmas Box. Use code CHRISTMAS5.",
    "default": ""
    //"default": "Sold out of Christmas boxes. Order your January box today - Shipping out on January 2nd. All subscriptions come with a special printable card for under-the-tree gifting. Use code CHRISTMAS5 to get $5 off."
    //"default": "Order today and get $5 OFF. Use code VDAY19."
  }

  constructor(gtag: Gtag, private route: ActivatedRoute) {
    this.gtag = gtag;
  }

  ngOnInit() {
    this.selectedOptions = {
      monthlyPlan: "1",
      sixMonthsPlan: "1",
      twelveMonthsPlan: "1"
    };
        
    this.sub = this.route.queryParams.subscribe(params => {
      this.utm_source = params.utm_source;
      this.utm_medium = params.utm_medium;
      this.utm_campaign = params.utm_campaign;
      this.utm_term = params.utm_term;
      this.utm_content = params.utm_content;
      if (this.utm_campaign) {
        var message: string = this.campaigns[this.utm_campaign];
        if (message) {
          this.message = message;
        } else {
          this.message = this.campaigns.default;
        }
      } else {
        this.message = this.campaigns.default;
      }
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addToCart(plan) {

    var option =
    {
      monthlyPlan:
      {
        children: [
          { price: "24.90", url: "https://hellobible.cratejoy.com/subscribe/2108509072_hellobible-1-child/2108509073_month-to-month" },
          { price: "29.80", url: "https://hellobible.cratejoy.com/subscribe/2108518485_hellobible-2-children/2108518481_month-to-month" },
          { price: "34.70", url: "https://hellobible.cratejoy.com/subscribe/2108530720_hellobible-3-children/2108530721_month-to-month" },
          { price: "39.60", url: "https://hellobible.cratejoy.com/subscribe/2108532982_hellobible-4-children/2108532983_month-to-month" }
        ]
      },
      sixMonthsPlan:
      {
        children: [
          { price: "143.40", url: "https://hellobible.cratejoy.com/subscribe/2108509072_hellobible-1-child/2108509075_6-month-prepay" },
          { price: "172.80", url: "https://hellobible.cratejoy.com/subscribe/2108518485_hellobible-2-children/2108518483_6-month-prepay" },
          { price: "202.20", url: "https://hellobible.cratejoy.com/subscribe/2108530720_hellobible-3-children/2108530723_6-month-prepay" },
          { price: "231.60", url: "https://hellobible.cratejoy.com/subscribe/2108532982_hellobible-4-children/2108532985_6-month-prepay" }
        ]
      },
      twelveMonthsPlan:
      {
        children: [
          { price: "262.80", url: "https://hellobible.cratejoy.com/subscribe/2108509072_hellobible-1-child/2108509076_12-month-prepay" },
          { price: "321.60", url: "https://hellobible.cratejoy.com/subscribe/2108518485_hellobible-2-children/2108518484_12-month-prepay" },
          { price: "380.40", url: "https://hellobible.cratejoy.com/subscribe/2108530720_hellobible-3-children/2108530724_12-month-prepay" },
          { price: "439.20", url: "https://hellobible.cratejoy.com/subscribe/2108532982_hellobible-4-children/2108532986_12-month-prepay" }
        ]
      }
    };

    var selected = this.selectedOptions[plan];
    var planObject = option[plan];
    var url = planObject.children[parseInt(selected) - 1].url + "?";
    if (this.utm_campaign) {
      url += "utm_campaign=" + this.utm_campaign;
    }
    if (this.utm_medium) {
      url += "&utm_medium=" + this.utm_medium;
    }
    if (this.utm_content) {
      url += "&utm_content=" + this.utm_content;
    }
    if (this.utm_term) {
      url += "&utm_term=" + this.utm_term;
    }
    if (this.utm_source) {
      url += "&utm_source=" + this.utm_source;
    }

    if (!isDevMode()) {
      this.gtag.event('cart', {
        event_label: 'add ' + planObject.children[parseInt(selected) - 1].url,
        value: planObject.children[parseInt(selected) - 1].price
      });
    }

    // redirect
    window.location.href = url;
  }

}
