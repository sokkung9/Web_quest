class ApiBoard {
  constructor(api) {
    this.api = api;
  }

  async create() {

  };

  async read(id) {
   const res = await this.api.get();
   return res;
  }
  async update() {

  }

  async delete() {

  }

}

export default ApiBoard;