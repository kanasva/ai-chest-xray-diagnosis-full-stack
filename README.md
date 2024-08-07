# AI Chest X-ray Diagnosis Full-stack

## TL;DR
This project utilises Next.js 14 as a full-stack framework to deliver diagnoses for 18 chest X-ray pathologies using [TorchXRayVision](https://github.com/mlmed/torchxrayvision), with the model deployed separately on AWS Lambda.

## Features
- Diagnosis for 18 chest X-ray pathologies, including Atelectasis, Cardiomegaly, Consolidation, Edema, Effusion, Emphysema, Enlarged Cardiomediastinum, Fibrosis, Fracture, Hernia, Infiltration, Lung Lesion, Lung Opacity, Mass, Nodule, Pleural Thickening, Pneumonia, and Pneumothorax.
- Detection of out-of-distribution images using an auto-encoder to prevent predictions on images that are different from the training data.
- Grad-CAM visualisation to highlight regions of interest in X-ray images
- GitHub OAuth authentication
- Global and user-specific quotas


## Technologies
- [TorchXRayVision](https://github.com/mlmed/torchxrayvision) - For chest X-ray analysis.
- [Next.js](https://nextjs.org/) - Framework for full-stack development.
- [React](https://react.dev/) - Front-end library for building user interfaces.
- [React Aria](https://react-spectrum.adobe.com/react-aria/) - For accessible and reusable UI components.
- [Tailwind CSS](https://tailwindcss.com/) - Fast and easy CSS styling.
- [Lucia Auth](https://lucia-auth.com/) - Authentication library.
- [ZSA](https://zsa.vercel.app/docs/introduction) - For React server actions.
- [Drizzle ORM](https://orm.drizzle.team/) - For database interactions.

## Project Architecture
This project uses a layered architecture to ensure modularity, maintainability, and scalability:
- **User Interface**: The front-end layer where users interact with the application.
- **Server Actions**: The backend layer to handle API interactions.
- **Use Cases**: The layer for business logic and application-specific functionality, such as quota checking.
- **Data Access**: The layer that manages data retrieval and storage operations.