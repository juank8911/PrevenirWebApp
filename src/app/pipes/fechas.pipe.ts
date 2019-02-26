import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: string): string {
    value = moment(value).format('DD-M-YYYY');
    console.log(value);
    return value;
  }
}
