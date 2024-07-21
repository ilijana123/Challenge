import React, { useEffect, useState } from 'react';
import { projectAPI } from './ProjectApi';
import './Project.css'; 
import { Project } from './Project';
import { PathFinder } from './PathFinder'; 

function ProjectPage() {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ path: string; letters: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    projectAPI
      .get()
      .then((data: string[][]) => {
        console.log('Fetched data:', data);
        if (Array.isArray(data) && data.every(row => Array.isArray(row))) {
          setProject({ grid: data });
          try {
            const pathResult = PathFinder(data);
            setResult(pathResult);
          } catch (error) {
            console.error('Error processing path:', error);
            setError('Error processing path: ' + (error as Error).message);
          }
        } else {
          console.error('Invalid data structure received:', data);
          setError('Invalid data structure received.');
        }
        setLoading(false);
      })
      .catch((e: Error) => {
        console.error('Error fetching data:', e);
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Project Detail</h1>

      {loading && (
        <div className="center-page">
          <span className="spinner primary"></span>
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse"></span> {error}
              </p>
            </section>
          </div>
        </div>
      )}

      {project ? (
        <div>
          <h2>Grid</h2>
          {project.grid.length === 0 ? (
            <p>No grid data available.</p>
          ) : (
            <div className="grid-container">
              {project.grid.map((row, rowIndex) => (
                <div className="grid-row" key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <div className="grid-cell" key={cellIndex}>
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {result && (
            <div>
              <h2>Path</h2>
              <p>{result.path}</p>
              <h2>Letters</h2>
              <p>{result.letters}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Project data is not available.</p>
      )}
    </div>
  );
}

export default ProjectPage;
