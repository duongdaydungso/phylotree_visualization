import { phylotree } from "phylotree";

class PhylogeneticTreeClass {
  private newickString: string;
  private tree: any;

  constructor(newickString: string) {
    this.newickString = newickString;
  }

  public setNewickInput(input: string) {
    this.newickString = input;
  }

  private initTreeFromNewick() {}
}
