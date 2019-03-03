import React, { Component } from 'react';
import moment from 'moment';
import logo from '../../assets/logo.png';
import { Container, Form } from './styles';
import CompareList from '../../components/CompareList';
import api from '../../services/api';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryInput: '',
    repositories: [],
    repositoryError: false,
  };

  componentDidMount() {
    const inLocal = localStorage.getItem('@githubCompare:repositories');
    if (!inLocal) {
      return;
    }
    this.setState({
      repositories: JSON.parse(inLocal),
    });
  }

  handleAddRepository = async (e) => {
    const { repositoryInput, repositories } = this.state;
    this.setState({ loading: true });
    e.preventDefault();
    try {
      const { data: repository } = await api.get(
        `/repos/${repositoryInput}?timestamp=${new Date().getTime()}`,
      );
      const inStateIndex = repositories.find(item => item.id === repository.id);
      repository.lastCommit = moment(repository.pushed_at).fromNow();
      const newRepositories = [...repositories];
      if (inStateIndex === -1) {
        newRepositories.push(repository);
      } else {
        newRepositories.splice(inStateIndex, 1, repository);
      }
      localStorage.setItem('@githubCompare:repositories', JSON.stringify(newRepositories));
      this.setState({
        repositoryInput: '',
        repositories: newRepositories,
        repositoryError: false,
      });
    } catch (err) {
      if (this.setState({ repositoryError: true }));
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = (repository) => {
    const { repositories } = this.state;
    const newRepos = repositories.filter(item => item.id !== repository.id);
    this.setState({
      repositories: newRepos,
    });
    localStorage.setItem('@githubCompare:repositories', JSON.stringify(newRepos));
  };

  handleRefresh = async (repository) => {
    const { repositories } = this.state;
    const repIndex = repositories.findIndex(item => item.id === repository.id);
    const { data } = await api.get(
      `/repos/${repository.owner.login}/${repository.name}?timestamp=${new Date().getTime()}`,
    );
    data.lastCommit = moment(repository.pushed_at).fromNow();
    repositories.splice(repIndex, 1, data);
    this.setState({
      repositories,
    });
    localStorage.setItem('@githubCompare:repositories', JSON.stringify(repositories));
  };

  render() {
    const {
      repositories, repositoryInput, repositoryError, loading,
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            name="usuario"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>
        <CompareList
          onRefresh={this.handleRefresh}
          onDelete={this.handleDelete}
          repositories={repositories}
        />
      </Container>
    );
  }
}
