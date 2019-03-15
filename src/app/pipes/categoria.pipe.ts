import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'categoria'
})
export class CategoriaPipe implements PipeTransform {

  transform(value) {
    console.log(value);

    if (!value) { } else {
        if (value.length === 1) {
        console.log('es 1');
    }
    }
  }
}
