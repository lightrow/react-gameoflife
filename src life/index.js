import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

/// <reference path="../node_modules/@types/react/index.d.ts" />

var yMax = 50;
var xMax = 70;
var pixels = yMax*xMax;
var generations = 0;

class Board extends React.Component{
    constructor(props){
        super(props)
        this.state={
            render:null
        }
        this.board = null
        this.squares = null
        this.running = false
        this.nextBoard = null
    }

    run(){
        this.running = (this.running? false:true)
        this.update()
    }

    check(squareID){
        var newStatus = null
        var neighbours = {}

        neighbours[1] = this.board[((squareID - 1) % xMax) > 0?((squareID - 1)):null]
        neighbours[2] = this.board[((squareID + 1) % xMax) > 0?((squareID + 1)):null]
        neighbours[3] = this.board[((squareID - xMax - 1) % xMax) > 0?((squareID - xMax - 1)):null]
        neighbours[4] = this.board[((squareID - xMax + 1) % xMax) > 0?((squareID - xMax + 1)):null]
        neighbours[5] = this.board[((squareID - xMax)) > 0?((squareID - xMax)):null]
        neighbours[6] = this.board[((squareID + xMax - 1) % xMax) > 0?((squareID + xMax - 1)):null]
        neighbours[7] = this.board[((squareID + xMax + 1) % xMax) > 0?((squareID + xMax + 1)):null]
        neighbours[8] = this.board[((squareID + xMax)) > 0?((squareID + xMax)):null]

        var alive = 0;
        var dead = 0
        for ( var i in neighbours ) {
            if ( neighbours[i] != undefined){
                if ( neighbours[i].status == 1 ) {
                    alive++
                } 
                if ( neighbours[i].status == 0 ) {
                    dead++
                } 
            } 
        }
        if  ( this.board[squareID].status == 1 && alive < 2 ){ newStatus = 0 }
        else if (this.board[squareID].status == 1 && alive > 3 ){ newStatus = 0}
        else if (this.board[squareID].status == 0 && alive == 3 ){ newStatus = 1}
        else if (this.board[squareID].status == 0 ) { newStatus = 0 }
        else { newStatus = 1 }
        this.nextBoard[squareID].status = newStatus
        pixels--
        if ( pixels <= 0 ) {
            generations++
            pixels=yMax*xMax
            this.board = JSON.parse(JSON.stringify(this.nextBoard))                      
        }
    }

    set(squareID){
        this.board[squareID].status = (this.board[squareID].status == 0? 1:0)
        this.makeSquares()   
        this.rerender()                      
    }

    generateBoard(how){
        generations = 0;
        var board = {}
        var squareIsD = 1
        var statusNew = null;
        for ( var j = 1; j <= yMax; j++ ){
            for ( var i = 1; i <= xMax; i++ ){
                if ( how == 'random' ) {statusNew = Math.floor(Math.random()*1.2)}
                    else {statusNew = 0}
                board[squareID]={xcoor:i, ycoor:j, status:statusNew}
                squareID++
            }
        }
    
        this.board = board
        this.nextBoard = JSON.parse(JSON.stringify(board)); // deep copy 
        this.makeSquares()
    }

    makeSquares(){
        var squares = []
        var squareID = 1
        for ( var j = 1; j <= yMax; j++ ){
            var row = []
            for ( var i = 1; i <= xMax; i++ ){
                row.push(<Square
                    squareid = {squareID}
                    status = {this.board[squareID].status}
                    check = {(squareID)=>this.check(squareID)}
                    set = {(squareID)=>this.set(squareID)}
                    running = {this.running}
                />)
                squareID++
            }
            row = <div className="row">{row}</div>
            squares.push(row)
        }
        this.squares = squares
    }

    clear(){
        this.generateBoard('empty')
        this.update()
    }

    updateOnce(){
        this.running = true
        this.makeSquares()  
        this.rerender()                      
        this.running = false        
    }

    update(){
        requestAnimationFrame(()=>{
            this.makeSquares()                        
            if ( this.running ) {this.update()}
            this.rerender()                                  
        })
    }
    reset(){
        this.running = false
        this.generateBoard('random')
        this.update()
    }

    componentDidMount(){
        this.generateBoard('random')
        this.update()
    }

    rerender(){
        if ( this.state.render ) {
            this.setState({render:false})
        } else {
            this.setState({render:true})            
        } 
    }

    render(){
        return(
            <div id="main" >
                <div className="generations">GENERATION: {generations}</div>
                {this.squares}
                <div className="controls"> 
                    <button className="run" onClick={()=>this.run()}>RUN | PAUSE</button>
                    <button className="update" onClick={()=>this.updateOnce()}>UPDATE</button>
                    <button className="clear" onClick={()=>this.clear()}>CLEAR</button>
                    <button className="clear" onClick={()=>this.reset()}>RESET</button>
                </div>
            </div>
        )
    }
}

class Square extends React.Component {

    componentDidUpdate(){
        if ( this.props.running ) {this.props.check(this.props.squareid)}
    }

    componentDidMount(){
        if ( this.props.running ) {this.props.check(this.props.squareid)}
    }

    render(){
        return(
            <div 
                onClick={()=>this.props.set(this.props.squareid)}
                className={'square ' + (this.props.status?'alive':'dead')}
            ></div>
        )
    }
}

ReactDOM.render(
    <Board/>,
    document.getElementById('root')
);
