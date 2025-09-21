import CardNota from "../components/CardNota";

export const HomePage = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-4 mt-16 xl:grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]">
        <CardNota texto="Asistencia" path="/asistencia" />
        <CardNota texto="Inscripcion" path="/inscripcion" />


    </div>
    
  );
};
