import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'asset-card',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {

  @Input() public asset;
  @Input() public assetIndex;
  constructor() { }

  ngOnInit() {
  }

}
