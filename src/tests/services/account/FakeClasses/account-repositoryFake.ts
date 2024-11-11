export class RepositoryFake {
  public create(): void {}
  public async save(): Promise<void> {}
  public async insert(): Promise<object> {
    return {
      identifiers: [{ id: 'mockId' }],
      generatedMaps: [],
      raw: [],
    };
  }
  public async remove(): Promise<void> {}
  public async findOne(): Promise<void> {}
  public async findAll(): Promise<void> {}
}
