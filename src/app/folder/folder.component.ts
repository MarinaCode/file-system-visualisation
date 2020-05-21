import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {FolderService} from '../folder.service';
import {Sort} from '@angular/material/sort';
export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  ENTER = 13,
  PAGE_UP = 33
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css'],
})
export class FolderComponent implements OnInit {
  private currentFolderdata: any;

  displayedColumns: string[] = ['name', 'modificationDate', 'type', 'size'];
  folderData: any = [];
  allFoldersData: any = [];
  currentPath: any = '/';
  selectedRow: any;
  @ViewChild('toolbar') toolbar: any;

  @HostListener('document:keyup', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      let index = this.findSelectedIndex();
      if (index === this.folderData.length - 1) {
        index = 0;
      } else {
        index = index + 1;
      }
      this.selectedRow = this.folderData[index];
    } else if (event.keyCode === KEY_CODE.UP_ARROW) {
      let index = this.findSelectedIndex();
      if (index === 0) {
        index = this.folderData.length - 1;
      } else {
        index = index - 1;
      }
      this.selectedRow = this.folderData[index];
    } else if (event.keyCode === KEY_CODE.ENTER && this.selectedRow) {
      this.navigateToFolder(this.selectedRow);
    } else if (event.keyCode === KEY_CODE.PAGE_UP) {
      this.toolbar.navigateBack();
    }
  }
  constructor(private appFolderService: FolderService) { }

  ngOnInit(): void {
    this.appFolderService.getJSON().
    subscribe(data => {
      const result = data.reduce((arr, file) => {
        const parentPath = file.path.split('/');
        return this.addPath(parentPath, arr, file, parentPath.length > 1 ? parentPath : '');
      }, []);
      this.folderData = result;
      this.allFoldersData = result;
      this.selectedRow = this.folderData[0];
      this.currentFolderdata = result;
    });
  }

  findSelectedIndex() {
    const index = this.folderData.findIndex((el) => {
      return el === this.selectedRow;
    });
    return index;
  }

  addPath(componentPaths, arr, file, parentPath ){
    const component = componentPaths.shift();
    let comp = arr.find(item => item.name === component);
    if (!comp) {
      comp = {
        name: component,
        modificationDate: file.modificationDate,
        path: file.path,
        size: file.size,
        type: file.type,
        parentPath
      };

      arr.push(comp);
    }

    if (componentPaths.length) {
      this.addPath(componentPaths, comp.children || (comp.children = []), file, comp.name);
    }
    return arr;
  }

  navigateToFolder(node) {
    if (node.children) {
      this.currentPath += node.name + '/';
      const filteredData = this.folderData.filter((element) => {
        return element.path === node.path;
      });
      this.folderData = filteredData[0].children;
      this.currentFolderdata = this.folderData;
      this.selectedRow = null;
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    const data = this.folderData.slice();
    if (!sort.active || sort.direction === '') {
      this.folderData = data;
      return;
    }

    this.folderData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'size': return this.compare(a.size, b.size, isAsc);
        case 'type': return this.compare(a.type, b.type, isAsc);
        case 'modificationDate': return this.compare(a.modificationDate, b.modificationDate, isAsc);
        default: return 0;
      }
    });
  }

  searchByText(obj, searchField, foundData) {
    obj.forEach(el => {
      if (el.name.indexOf(searchField) !== -1) {
        foundData.push(el);
      }
      if (el.children && el.children.length > 0) {
        this.searchByText(el.children, searchField, foundData);
      }
    });
    return foundData;
  }

  updateHierarchy(data: any) {
    this.folderData = data.result;
    this.currentPath = data.navigationPath;
    this.currentFolderdata = this.folderData;
  }

  toggleSearch(searchText: any) {
    let foundData = [];
    if (searchText === '') {
      foundData = this.currentFolderdata;
    } else {
      foundData = this.searchByText(this.currentFolderdata, searchText, foundData);
    }
    this.folderData = foundData;
  }

  highlight(row){
    this.selectedRow = row;
  }
}
