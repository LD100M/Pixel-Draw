import React, { Component } from "react";
import { solid, split, Square } from './square';
import {FileEditor} from './FileEditor';
import { FilePicker } from "./FilePicker";
import { listFiles, loadFile, saveFile } from "./server";

/** Describes set of possible app page views */
type Page = {kind: "Picker"} | {kind: "Editor"};          

type AppState = {
  /**  The page to show */
  show: Page;   

  /**  The name of the file */
  name: string; 

  /**  The current square to be selected */
  curSquare: Square | null;

  /**  The names of all the files */
  fileNames: string[];

  /**  The status of loading file */
  isloading: boolean;
};

/**
 * Displays the square application containing either a list of files names
 * to pick from or an editor for files files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {show: {kind: "Picker"}, name: "", fileNames: [], isloading: false, curSquare: null}; 
  }
  
  render = (): JSX.Element => {
    const sq: Square = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));

    if(!this.state.isloading) {
      if(this.state.show.kind === "Picker") {
        return <FilePicker onCreateClick={this.doCreateClick} onNameChange={this.doNameChange} fileNames={this.state.fileNames} onFileNameClick={this.doFileNameClick}/>
      }
      else {
        if(this.state.curSquare !== null) {
          return <FileEditor initialState={this.state.curSquare} onSave={this.doSaveClick} name={this.state.name} onBack={this.doBackClick}/>
        }
        return <FileEditor initialState={sq} onSave={this.doSaveClick} name={this.state.name} onBack={this.doBackClick}/>
      }
    }
    else {
      return <p>Loading</p>
    }
  };

  // Callback function to update the list of filenames with the provided list of file names.
  doListCallbackClick = (names: string[]): void => {
    this.setState({fileNames: names});
  }

  // Funciton changes the state to display the editor page after the user clicks on the create button.
  doCreateClick = (): void => {
    const sq: Square = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
    this.setState({show: {kind: "Editor"}, curSquare: sq});
  }

  // Funciton updates the name of the square as the user types in their name
  doNameChange = (userName: string): void => {
    this.setState({name: userName});
  }

  // Function called after the component is mounted. Initiates the list update process
  componentDidMount = ():  void => {
    this.doUpdateListClick(); 
  }
  
  // callBack function to save the files.
   doSaveCallBackClick = (_name: string, _saved: boolean): void => {
    return;
  }

  // Function updates the list of filenames after the user clicks on the list of fileNames
  doUpdateListClick = (): void =>{
    this.setState({isloading: true});
    listFiles(this.doListCallbackClick);
    this.setState({isloading: false});
  }

  // Function adds the square that the user creates to the list of squares 
  // that has been created when the save button is clicked.
  doSaveClick = (name: string, root: Square): void => {
    this.setState({isloading: true});
    saveFile(name, root, this.doSaveCallBackClick);
    this.setState({isloading: false});
  }

  // Function changes the state to display the Picker page after the user
  // clicks on the back button.
  doBackClick = (): void => {
    this.setState({show: {kind: "Picker"}})
    this.doUpdateListClick();
  }

  // call back function that updates the page to editor page and replace the 
  // the name of the file and the corresponded file to the given ones.
  doLoadResp = (name: string, root: Square | null): void => {
    this.setState({show: {kind: "Editor"}, name: name, curSquare: root} );
  }

  // Function changes the state to display the Editor page and the name of 
  // the square to be displayed to the given name after the user clicks on the 
  // link of the square to be displayed.
  doFileNameClick = (fileName: string): void => {
    this.setState({isloading: true});
   loadFile(fileName, this.doLoadResp);
   this.setState({isloading: false});
  }
}
