import React from 'react';
import PropTypes from 'prop-types';
import { Container, Repository } from './styles';

const CompareList = ({ repositories, onDelete, onRefresh }) => (
  <Container>
    {repositories.map(repository => (
      <Repository key={repository.id}>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>

        <ul>
          <li>
            {repository.stargazers_count}
            {' '}
            <small>starts</small>
          </li>
          <li>
            {repository.forks_count}
            {' '}
            <small>forks</small>
          </li>
          <li>
            {repository.open_issues_count}
            {' '}
            <small>issues</small>
          </li>
          <li>
            {repository.lastCommit}
            {' '}
            <small>last commit</small>
          </li>
        </ul>
        <footer>
          <i
            role="button"
            tabIndex={0}
            onClick={e => onRefresh(repository, e)}
            onKeyDown={e => onRefresh(repository, e)}
            className="fa fa-refresh"
            title="refresh repository"
          />
          <i
            role="button"
            tabIndex={0}
            onClick={e => onDelete(repository, e)}
            onKeyDown={e => onDelete(repository, e)}
            className="fa fa-times"
            title="delete repository"
          />
        </footer>
      </Repository>
    ))}
  </Container>
);

CompareList.defaultProps = {
  onDelete: () => {},
  onRefresh: () => {},
};

CompareList.propTypes = {
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      stargazers_count: PropTypes.number,
      forks_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      lastCommit: PropTypes.string,
    }),
  ).isRequired,
  onDelete: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default CompareList;
