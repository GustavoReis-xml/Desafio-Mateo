import { Schema, model, Document } from 'mongoose';

export interface IMeteo extends Document {
  Date: string;
  Time: string;
  Temp_C: number;
  Hum_Per: number;
  Press_Bar: number;
  WindSpeed_Avg: number;
  WindDir_Avg: number;
}

const meteoSchema = new Schema<IMeteo>({
  Date: { type: String, required: true },
  Time: { type: String, required: true },
  Temp_C: { type: Number, required: true },
  // Lembre-se que 'Hum_%' foi renomeado para Hum_Per
  Hum_Per: { type: Number, required: true },
  Press_Bar: { type: Number, required: true },
  WindSpeed_Avg: { type: Number },
  WindDir_Avg: { type: Number },
}, {
  timestamps: true,
  collection: 'dados_meteorologicos'
});

const Meteo = model<IMeteo>('Meteo', meteoSchema);

export default Meteo;