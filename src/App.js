import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import dataCities from './components/data-cities'
import AppContainer from './components/app-container'
import './App.css'

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      data: [],
      isFetching: true,
      city: props.params.city,
      candidateType: props.params.type || 'prefeitos',
      candidateId: props.params.id
    }

    this.componentWillUpdate = this.componentWillUpdate.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.params.city !== nextState.city) {
      this.setState({
        city: nextProps.params.city,
        isFetching: true
      }, ()=> {
        this.getData()
      })
    }
  }

  componentWillMount() {
    this.getData()
  }

  handleMenu(type) {
    return (type) => {
      this.setState({
        candidateType: type,
        isFetching: true
      }, () => {
        this.getData()
      })
    }
  }

  getData() {
    if( this.state.city ) {
      console.log(this.state.city)
      let cityCode = _.filter(dataCities, {slug: this.state.city})[0].id
      let candidateCode = (this.state.candidateType === 'prefeitos') ? '11' : '13'

      axios.get(`http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2016/${cityCode}/2/${candidateCode}/candidatos`)
        .then(response => {
          this.setState({
            data: response.data.candidatos
          }, () => {
            this.setState({
              isFetching: false
            })
          })
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      this.setState({
        isFetching: false
      })
    }
  }

  render() {
    return (
      <AppContainer
        data={this.state.data}
        isFetching={this.state.isFetching}
        city={this.state.city}
        candidateType={this.state.candidateType}
        handleMenu={this.handleMenu(this.state.candidateType)}
        children={this.props.children}
      />
    )
  }
}

export default App
