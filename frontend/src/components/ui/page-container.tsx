export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6 px-6 pb-8 pt-6 md:px-8 md:pt-7 xl:pr-12">
      {children}
    </div>
  );
};

export const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full items-center justify-between">{children}</div>
  );
};

export const PageHeaderContent = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="space-y-1.5">{children}</div>;

export const PageTitle = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-2xl font-semibold text-[#e8eeff]">{children}</h1>
);

export const PageDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className="text-sm text-[#a4b0d9]">{children}</p>;

export const PageActions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">{children}</div>
);

export const PageContent = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-6">{children}</div>
);
