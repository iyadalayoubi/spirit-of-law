import { Link } from 'react-router-dom'
import { useLanguage } from '@hooks/useLanguage'

function NotFound() {
  const { isRTL } = useLanguage()

  return (
    <div className="not-found">
      <div className="not-found__inner">
        <span className="not-found__code">٤٠٤</span>
        <h1 className="not-found__title">
          {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="not-found__body">
          {isRTL
            ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : 'The page you are looking for does not exist or has been moved.'}
        </p>
        <Link to="/" className="not-found__link">
          {isRTL ? '← العودة للرئيسية' : '← Back to Home'}
        </Link>
      </div>
    </div>
  )
}

export default NotFound