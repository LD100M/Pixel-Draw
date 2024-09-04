import React, { Component, ChangeEvent, MouseEvent } from "react";

type FilePickerProps = {

  /** Called to go back to the create a new square */
  onCreateClick: () => void;

  /** Called to change the name in the input box */
  onNameChange: (name: string) => void;

  /** a list of file names*/
  fileNames: string[]; 

  /** Called to change the file name */
  onFileNameClick: (fileName: string) => void;
};

type FilePickerState = {}; 

/** Displays the list of created design files. */
export class FilePicker extends Component<FilePickerProps, FilePickerState> {

  constructor(props: FilePickerProps) {
    super(props);
  }

  render = (): JSX.Element => {
    const fileList: JSX.Element[] = [];
    
    for (const fileName of this.props.fileNames) {
      fileList.push(<li key={fileName}><a href= "#" onClick={() => this.props.onFileNameClick(fileName)}>{fileName}</a></li>);
    }
    return (<div>
        <h3>Files</h3>

        <label id="name">Name: </label>
        <input type="text" id= "name" onChange={this.doNameChange}></input>
        <button onClick={this.doCreateClick}>Create</button>
        <ul>
        {fileList}
        </ul>
      </div>);
  };

  // Updates our record with the name text being typed in
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.props.onNameChange(evt.target.value);
  };

  // Updates the UI to show the file editor
  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onCreateClick();
  };
}
