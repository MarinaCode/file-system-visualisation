import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header-navigation',
  templateUrl: './header-navigation.component.html',
  styleUrls: ['./header-navigation.component.css']
})
export class HeaderNavigationComponent implements OnInit, OnChanges {
  @Input() navigationPath;
  @Input() currentData: any;
  @Input() allData: any;
  @Output() toggleSearch: EventEmitter<any> = new EventEmitter();
  @Output() updateGrid: EventEmitter<any> = new EventEmitter();
  private result: any;

  constructor() {}
  ngOnInit(): void {}

  getCurrentPathObject(data, path, foundedElement) {
    data.forEach(el => {
      if (el.parentPath === path) {
        foundedElement.push(el);
        return foundedElement;
      } else {
        if (el.children) {
          this.getCurrentPathObject(el.children, path, foundedElement);
        }
      }
    });
  }

  navigateBack() {
    this.result = [];
    let arr = this.navigationPath.split('/');
    arr = arr.filter((el, index) => {
      return el !== '' || index === 0;
    });
    arr.splice(-1);

    if (arr.length > 1) {
      this.navigationPath = arr.join('/');
      this.navigationPath += '/';
    } else if (arr[0] === '') {
      this.navigationPath =  '/' ;
    }
    const lastElement = arr[arr.length - 1];
    if (lastElement != null) {
      this.getCurrentPathObject(this.allData, arr[arr.length - 1], this.result);
      this.updateGrid.emit({result: this.result, navigationPath: this.navigationPath});
    }
  }

  searchFiles(event) {
    event.stopPropagation();
    let searchText = event.target.value;
    searchText = searchText.trim();
    this.toggleSearch.emit(searchText);

  }

  ngOnChanges(value): void {
    this.result = this.currentData;
  }
}
