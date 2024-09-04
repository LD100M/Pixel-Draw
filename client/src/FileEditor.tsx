import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, solid, toColor, replaceRoot, findRoot, split  } from './square';
import { SquareElem } from "./square_draw";
import { len, prefix, nil } from "./list";


type FileEditorProps = {
  /** Initial state of the file. */
  initialState: Square;

  /** Called to ask parent to save file contents in server. */
  onSave: (name: string, root: Square) => void;

 /** User inputted file name */
  name: string;

  /** Called to go back to the picker page */
  onBack: () => void;
};


type FileEditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;

  /** The color of the square to select */
  color: string;
};


/** UI for editing square design page. */
export class FileEditor extends Component<FileEditorProps, FileEditorState> {

  constructor(props: FileEditorProps) {
    super(props);
    this.state = { root: props.initialState, color: "Color" };
  }

  render = (): JSX.Element => {
    return (
     <div>
        <SquareElem width={600n} height={600n}
          square={this.state.root} selected={this.state.selected}
          onClick={this.doSquareClick}></SquareElem>
          {this.renderButton()}
        <button onClick={this.doSaveClick}>Save</button>
        <button onClick={this.doBackClick}>Back</button>
     </div>
     )         
  };

  // function renders the buttons for merge, split and the drop down menu to choose colors
  renderButton = (): JSX.Element => {
    if(this.state.selected) {
      return <div>
        <button onClick={this.doSplitClick}>Split</button>
        <button onClick={this.doMergeClick}>Merge</button>
        <select id ="colorSelect" onChange={this.doColorChange} value={this.state.color}>
          <option>Color</option>
          <option>white</option>
          <option>red</option>
          <option>orange</option>
          <option>yellow</option>
          <option>green</option>
          <option>blue</option>
          <option>purple</option>
        </select>
      </div>;
    }
    else {
      return <div></div>;
    }
  };

  // function allows the selection of a particular square by clicking on it.
  doSquareClick = (path: Path): void => {
    this.setState({selected: path}) 
  }

  // functions allows the user to split the selected square by clicking the split button
  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if(this.state.selected) {
      const temp = findRoot(this.state.selected, this.state.root);
      this.setState({root: replaceRoot(this.state.selected, this.state.root, split(temp, temp, temp, temp)), selected: undefined})
    }
  };

  // functions allows the user to merge the selected square by clicking the merge button
  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if(this.state.selected && this.state.selected !== nil) {
      const parentPath = prefix(len(this.state.selected) - 1n, this.state.selected); 
      const temp = findRoot(this.state.selected, this.state.root);
      this.setState({root: replaceRoot(parentPath, this.state.root, temp), selected: undefined});
    }
  };

  // functions allows the user to change the color of the selected square from the drop down menu
  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    if(this.state.selected) {
      this.setState({
        root: replaceRoot(this.state.selected, this.state.root, solid(toColor(evt.target.value))),
        color: "Color"
      })
    }
    // const selectElement =  document.getElementById("colorSelect") as HTMLSelectElement;
    // selectElement.value = "color"; 
  };

  // functions allows the user to save the square pattern that he creates by clicking th save button
  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onSave(this.props.name, this.state.root); 
  }

  // functions allows the user to go back the the file picker page by clicking th back button
  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBack();
  }
}
