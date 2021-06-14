import axios from 'axios';
import ApiBoard from './api_board';

export default class API {
  static db = axios.create({
    // timeout: 10000,
    headers: {
      'content-type': 'application/json',
      'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoxNzIzLCJuaWNrbmFtZSI6IuyCrOyghOqzvOygnOydkeyLnOyekCIsInVuaXZlcnNpdHkiOjE1LCJtYWpvciI6MzA1LCJlbWFpbENoZWNrIjowLCJpc1N1cHBvcnQiOnRydWUsInJvbGUiOjAsImlhdCI6MTYyMzMxNDcxOSwiZXhwIjoxNjI2OTExMTE5LCJpc3MiOiJib2JhZSJ9.u4_Y5L2sxCKNxN7Evjeyq4BPifjJ0n3DparCLA3ZG0w',
    },
  });


  static board = new ApiBoard(this.db);

}