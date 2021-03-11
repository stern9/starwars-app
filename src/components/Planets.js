import { useState } from "react";
import { useQuery } from "react-query";
import Planet from "./Planet";

const fetchPlanets = async ({ queryKey }) => {
  console.log(queryKey[1]);
  const res = await fetch(`http://swapi.dev/api/planets/?page=${queryKey[1]}`);
  return res.json();
};

const Planets = () => {
  const [page, setPage] = useState(1);
  const { data, latestData, status } = useQuery(
    ["planets", page],
    (page) => fetchPlanets(page),
    { keepPreviousData: true }
  );

  return (
    <div>
      <h2>Planets</h2>

      {status === "loading" && <div>Loading data</div>}

      {status === "error" && <div>Error fetching data</div>}

      {status === "success" && (
        <>
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous Page
          </button>
          <span>{page}</span>
          <button
            onClick={() =>
              setPage((old) =>
                !latestData || !latestData.next ? old : old + 1
              )
            }
            disabled={!latestData || !latestData.next}
          >
            Next page
          </button>
          <div>
            {data.results.map((planet) => (
              <Planet key={planet.name} planet={planet} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Planets;
